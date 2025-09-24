<?php

namespace App\Repository;

use App\Models\Note;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminRepo {

    public function getTotalCounts() {
        try {
            $totalUsers = DB::table('users')->count();
            $totalNotes = DB::table('notes')->count();
            return [
                'totalUsers' => $totalUsers,
                'totalNotes' => $totalNotes,
            ];
        } catch (\Exception $e) {
            return [
                'error' => 'Failed to fetch total counts',
                'message' => $e->getMessage()
            ];
        }
    }


    public function countNotes() {
        try {
            $notes = DB::table('notes')
            ->selectRaw('YEAR(NOW()) as year, MONTH(created_at) as month, COUNT(*) as count')
            ->groupBy('year', 'month')
            ->get();
            $notesPerMonth = array_fill(1, 12, 0); 
            foreach ($notes as $note) {
                $notesPerMonth[$note->month] = $note->count;
            }
            return $notesPerMonth;
        } catch (\Exception $e) {
            return [
                'error' => 'Failed to fetch notes count',
                'message' => $e->getMessage()
            ];
        }
    }


    public function countUsers() {
        try {
            $users = DB::table('users')
            ->selectRaw('YEAR(NOW()) as year, MONTH(created_at) as month, COUNT(*) as count')
            ->groupBy('year', 'month')
            ->get();
            $usersPerMonth = array_fill(1, 12, 0);
            $amount = 0;
            foreach ($users as $user) {
                $usersPerMonth[$user->month] = $user->count;
                $amount += $user->count;
            }
            return [$usersPerMonth, $amount];
        } catch (\Exception $e) {
            return [
                'error' => 'Failed to fetch users count',
                'message' => $e->getMessage()
            ];
        }
    }


     public function getUsers()
    {
        try {
            $users = DB::table('users')->where('banned', 0)->get();
            // $users = DB::select("SELECT u.id, u.email, u.created_at, u.updated_at, count(n.id) as total from users u 
            // left join notes n on u.id = n.userId
            // group by u.id, u.email");

            return $users;
        } catch (\Exception $e) {
            return [
                'error' => 'Failed to fetch users',
                'message' => $e->getMessage()
            ];
        }
    }

    public function getNotes()
    {
        try {
            $notes = DB::table('notes')->get();
            return $notes;

        } catch (\Exception $e) {
            return [
                'error' => 'Failed to fetch notes',
                'message' => $e->getMessage()
            ];
        }
    }

    public function getUserDetails(int $userId)
    {
        try {
            $user = User::with(['notes' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }])->findOrFail($userId);

            return $user;

        } catch (\Exception $e) {
            return[
                'error' => 'User not found',
                'message' => $e->getMessage()
            ];
        }
    }
    
    public function deleteUser(int $userId)
    {
        try {
            $user = User::find($userId);
            if (!$user) {
                return [
                    'error' => 'User not found'
                ];
            }
            $user->banned = 1;
            $user->save();
            $notes = Note::where('userId', $userId)->update(['isCur' => 0]);
            return [
                'message' => 'User and all their notes deleted successfully'
            ];
        } catch (\Exception $e) {
            return [
                'error' => 'Failed to delete user',
                'message' => $e->getMessage()
            ];
        }
    }

    public function getAnalytics()
    {
        try {
            // Get users by registration month (last 12 months)
            $usersByMonth = DB::table('users')
                ->select(DB::raw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count'))
                ->where('created_at', '>=', Carbon::now()->subMonths(12))
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();

            // Get notes by creation month (last 12 months)
            $notesByMonth = DB::table('notes')
                ->select(DB::raw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count'))
                ->where('created_at', '>=', Carbon::now()->subMonths(12))
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get();

            // Get most active users
            $mostActiveUsers = User::withCount('notes')
                ->orderBy('notes_count', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'notes_count' => $user->notes_count,
                    ];
                });


            $recentUsers = User::orderBy('created_at', 'desc')->limit(5)->get();
            $recentNotes = Note::with('user:id,name')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($note) {
                    return [
                        'id' => $note->id,
                        'title' => $note->title,
                        'user' => $note->user,
                        'created_at' => $note->created_at,
                    ];
                });

            return response()->json([
                'usersByMonth' => $usersByMonth,
                'notesByMonth' => $notesByMonth,
                'mostActiveUsers' => $mostActiveUsers,
                'recentUsers' => $recentUsers,
                'recentNotes' => $recentNotes,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch analytics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getAllUsers(): Collection
    {
        return User::all();
    }

}