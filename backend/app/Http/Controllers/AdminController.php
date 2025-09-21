<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Http\Controllers\UserController;

class AdminController extends Controller
{
    public function getTotalCounts(Request $request): JsonResponse {
        try {
            $totalUsers = DB::table('users')->count();
            $totalNotes = DB::table('notes')->count();

            return response()->json([
                'totalUsers' => $totalUsers,
                'totalNotes' => $totalNotes,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch total counts',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function countNotes(Request $request) {
        try {
            $notes = DB::select("SELECT year(now()) as year, month(created_at) as month, count(*) as count from notes group by year, month");
            $notesPerMonth = array_fill(1, 12, 0); 
            foreach ($notes as $note) {
                $notesPerMonth[$note->month] = $note->count;
            }
            return response()->json($notesPerMonth);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch notes count',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function countUsers(Request $request) {
        try {
            $users = DB::select("SELECT year(now()) as year, month(created_at) as month, count(*) as count from users group by year, month");
            $usersPerMonth = array_fill(1, 12, 0);
            $amount = 0;
            foreach ($users as $user) {
                $usersPerMonth[$user->month] = $user->count;
                $amount += $user->count;
            }
            return response()->json([$usersPerMonth, $amount]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch users count',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getUsers(Request $request)
    {
        try {
            $users = DB::select("SELECT * from users u where u.banned = 0");
            // $users = DB::select("SELECT u.id, u.email, u.created_at, u.updated_at, count(n.id) as total from users u 
            // left join notes n on u.id = n.userId
            // group by u.id, u.email");
            
            return response()->json($users);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch users',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function getNotes(Request $request): JsonResponse
    {
        try {
            $notes = DB::select("SELECT * from notes n");
            return response()->json($notes);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch notes',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function getUserDetails(Request $request, $userId): JsonResponse
    {
        try {
            $user = User::with(['notes' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }])->findOrFail($userId);

            return response()->json([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'notes_count' => $user->notes->count(),
                'notes' => $user->notes->map(function ($note) {
                    return [
                        'id' => $note->id,
                        'title' => $note->title,
                        'content' => $note->content,
                        'created_at' => $note->created_at,
                        'updated_at' => $note->updated_at,
                    ];
                }),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'User not found',
                'message' => $e->getMessage()
            ], 404);
        }
    }


    public function deleteUser(Request $request, $userId): JsonResponse
    {
        try {
            $user = DB::update('UPDATE users SET banned = 1 WHERE id = ?', [$userId]);
            $notes = DB::update('UPDATE notes SET isCur = 0 WHERE userId = ?', [$userId]);

            return response()->json([
                'message' => 'User and all their notes deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete user',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getAnalytics(Request $request): JsonResponse
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
}