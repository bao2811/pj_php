<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Http\Controllers\UserController;
use App\Services\AdminService;

class AdminController extends Controller
{
    protected $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->adminService = $adminService;
    }

    public function getTotalCounts(Request $request): JsonResponse {
        try {
            
            $data = $this->adminService->getTotalCounts();
            $totalUsers = $data['totalUsers'];
            $totalNotes = $data['totalNotes'];

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
            $notesPerMonth = $this->adminService->countNotes();
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
            $usersPerMonth = $this->adminService->countUsers();
            return response()->json($usersPerMonth);
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
            $users = $this->adminService->getAllUser();
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
            $notes = $this->adminService->getNotes();
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
            $user = $this->adminService->getUserDetails($userId);

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
            $this->adminService->deleteUser($userId);
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

    
}