<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;


class AdminController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|unique:admins',
            'password' => 'required|min:8',
        ]);

        $admin = new Admin();
        $admin->username = $request->username;
        $admin->password = Hash::make($request->password);
        $admin->save();

        return response()->json(['message' => 'Admin created successfully']);
    }

    public function index()
    {
        $admins = Admin::all();
        return response()->json($admins);
    }

    public function show($id)
    {
        $admin = Admin::findOrFail($id);
        return response()->json($admin);
    }

    public function changeUsername(Request $request)
    {
        // Log incoming request for debugging purposes
        Log::info('Change Username request received', [
            'adminId' => $request->adminId,
            'username' => $request->username,
            'answer' => $request->securityAnswer
        ]);

        // Manually create the validator instance
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|unique:admins,username,' . $request->adminId,
            'securityAnswer' => 'required|string',
        ]);

        // Log the validation process
        Log::info('Validation started for username change', [
            'adminId' => $request->adminId,
            'validationRules' => $validator->getRules()
        ]);

        // Check if validation failed
        if ($validator->fails()) {
            // Log the validation errors for debugging
            Log::error('Username change validation failed', [
                'adminId' => $request->adminId,
                'errors' => $validator->errors()->all()
            ]);

            // Return response with the errors
            return response()->json(['errors' => $validator->errors()->all()], 422);
        }

        // Retrieve the admin (use the admin_id from the request)
        Log::info('Attempting to find admin in the database', ['adminId' => $request->adminId]);
        $admin = Admin::find($request->adminId);
        if (!$admin) {
            // Log that the admin was not found
            Log::warning('Admin not found in database', ['adminId' => $request->adminId]);

            return response()->json(['message' => 'Admin not found'], 404);
        }

        // Log that the admin was found successfully
        Log::info('Admin found in database', [
            'adminId' => $admin->id,
            'currentUsername' => $admin->username
        ]);

        // **Verify the security answer - directly compare the plain text answer with the hashed value**
        Log::info('Verifying security answer for admin', ['adminId' => $admin->id]);

        if (Hash::check($request->securityAnswer, $admin->security_answer)) {
            // Log successful security answer verification
            Log::info('Security answer verified successfully', ['adminId' => $admin->id]);

            // Log the old username before update
            Log::info('Current username', ['adminId' => $admin->id, 'oldUsername' => $admin->username]);

            // Update the username using the update() method
            $oldUsername = $admin->username;
            $admin->update([
                'username' => $request->username
            ]);

            // Log the successful username update and the change from old to new username
            Log::info('Username updated successfully', [
                'adminId' => $admin->id,
                'oldUsername' => $oldUsername,
                'newUsername' => $admin->username
            ]);

            return response()->json(['message' => 'Username updated successfully']);
        }

        // Log failed security answer verification
        Log::warning('Invalid security answer', ['adminId' => $request->adminId]);

        return response()->json(['message' => 'Invalid security answer'], 400);
    }

    public function changePassword(Request $request)
    {
        // Log the request data for debugging purposes
        Log::info('Password change request received', ['request_data' => $request->all()]);

        // Validate the request
        $request->validate([
            'admin_id' => 'required|integer',  // Ensure admin_id is passed
            'current_password' => 'required|string',  // Admin must provide current password
            'new_password' => 'required|string|min:8|confirmed',  // New password must meet requirements
            'security_answer' => 'required|string',  // Admin must answer the security question
        ]);

        // Retrieve the admin using the provided admin_id
        $admin = Admin::find($request->admin_id);  // Find the admin by ID from the request

        if (!$admin) {
            Log::error('Admin not found', ['admin_id' => $request->admin_id]);
            return response()->json(['message' => 'Admin not found'], 404);
        }

        Log::info('Admin found', ['admin_id' => $admin->id]);

        // Check if the provided current password matches the hashed password in the database
        if (Hash::check($request->current_password, $admin->password)) {
            Log::info('Current password matched, proceeding to update the password.');

            // Verify the security answer
            if (Hash::check($request->security_answer, $admin->security_answer)) {
                Log::info('Security answer matched, updating the password.');

                // Hash the new password
                $hashedNewPassword = Hash::make($request->new_password);
                Log::info('New password hash being saved: ' . $hashedNewPassword);  // Log hash before updating

                // Update the password directly using `update()`
                Admin::whereId($admin->id)->update([
                    'password' => $hashedNewPassword
                ]);

                // Log the stored password hash after the update for debugging
                $admin = Admin::find($admin->id);  // Reload the admin to check the updated value
                Log::info('Updated password hash from DB: ' . $admin->password);

                // Now check if the entered password matches the stored hash
                $isMatch = Hash::check($request->new_password, $admin->password);
                Log::info('Password hash comparison result: ' . ($isMatch ? 'Match' : 'No Match'));

                if ($isMatch) {
                    Log::info('Entered password matches the stored one.');
                    return response()->json(['message' => 'Password updated successfully']);
                } else {
                    Log::warning('Entered password does not match the stored one', ['admin_id' => $admin->id]);
                    return response()->json(['message' => 'Password update failed'], 400);
                }
            } else {
                Log::warning('Security answer did not match', ['admin_id' => $admin->id]);
                return response()->json(['message' => 'Incorrect security answer'], 400);
            }
        }

        Log::warning('Invalid current password attempt', ['admin_id' => $admin->id]);
        return response()->json(['message' => 'Invalid current password'], 400);
    }


    // Method to update security question
    public function updateSecurityQuestion(Request $request)
    {
        // Log the request data for debugging purposes
        Log::info('Updating security question request received', ['request_data' => $request->all()]);

        // Validate the request
        $request->validate([
            'admin_id' => 'required|integer',  // Ensure admin_id is passed
            'new_security_question' => 'required|string',
            'new_security_answer' => 'required|string',
            'admin_password' => 'required|string',  // Admin must authenticate
        ]);

        // Retrieve the admin using the provided admin_id
        $admin = Admin::find($request->admin_id);  // Find the admin by ID from the request

        if (!$admin) {
            Log::error('Admin not found', ['admin_id' => $request->admin_id]);
            return response()->json(['message' => 'Admin not found'], 404);
        }

        Log::info('Admin found', ['admin_id' => $admin->id]);

        // Check if the provided password matches the hashed password in the database
        if (Hash::check($request->admin_password, $admin->password)) {
            Log::info('Admin password matched, updating security answer.');

            // Hash the new security answer
            $hashedAnswer = Hash::make($request->new_security_answer);
            Log::info('Hash being saved: ' . $hashedAnswer);  // Log hash before updating

            // Update the security question and answer directly using `update()`
            Admin::whereId($admin->id)->update([
                'security_question' => $request->new_security_question,
                'security_answer' => $hashedAnswer
            ]);

            // Log the stored hash after the update for debugging
            $admin = Admin::find($admin->id);  // Reload the admin to check the updated value
            Log::info('Updated Hash from DB: ' . $admin->security_answer);

            // Now check if the entered answer matches the stored hash
            $isMatch = Hash::check($request->new_security_answer, $admin->security_answer);
            Log::info('Hash comparison result: ' . ($isMatch ? 'Match' : 'No Match'));

            if ($isMatch) {
                Log::info('Entered security answer matches the stored one.');
                return response()->json(['message' => 'Security question and answer updated successfully']);
            } else {
                Log::warning('Entered security answer does not match the stored one', ['admin_id' => $admin->id]);
                return response()->json(['message' => 'Incorrect security answer'], 400);
            }
        }

        Log::warning('Invalid admin password attempt', ['admin_id' => $admin->id]);
        return response()->json(['message' => 'Invalid admin password'], 400);
    }

    public function forgotPassword(Request $request)
    {
        // Log the request data for debugging purposes
        Log::info('Forgot Password request received', ['request_data' => $request->all()]);

        // Validate the request
        $request->validate([
            'username' => 'required|string',  // Ensure username is passed
            'new_password' => 'required|string|min:8|confirmed',  // Ensure password is strong and confirmed
            'security_question' => 'required|string',  // Security question should be provided
            'security_answer' => 'required|string',  // Security answer should be provided
        ]);

        // Retrieve the admin using the provided username (email or username)
        $admin = Admin::where('username', $request->username)  // Or check for username
            ->first();

        if (!$admin) {
            Log::error('Admin not found', ['username' => $request->username]);
            return response()->json(['message' => 'Admin not found'], 404);
        }

        Log::info('Admin found', ['admin_id' => $admin->id]);

        // Verify if the provided security question matches the one in the database
        if ($admin->security_question !== $request->security_question) {
            Log::warning('Security question mismatch', ['admin_id' => $admin->id]);
            return response()->json(['message' => 'Incorrect security question'], 400);
        }

        // Verify the provided security answer against the stored hash
        $isMatch = Hash::check($request->security_answer, $admin->security_answer);

        if (!$isMatch) {
            Log::warning('Incorrect security answer', ['admin_id' => $admin->id]);
            return response()->json(['message' => 'Incorrect security answer'], 400);
        }

        Log::info('Security question and answer matched, allowing password reset.');

        // Hash the new password
        $hashedPassword = Hash::make($request->new_password);

        // Log the password hash before updating
        Log::info('New password hash being saved for admin', ['admin_id' => $admin->id, 'new_password_hash' => $hashedPassword]);

        // Update the password in the database using the update() method
        $updateStatus = Admin::where('id', $admin->id)->update(['password' => $hashedPassword]);
        Log::info('Updated Hash from DB: ' . $admin->password);
        Log::info('Hashed: ' . $hashedPassword);

        if ($updateStatus) {
            Log::info('Password updated successfully for admin', ['admin_id' => $admin->id]);
            // Return a success response
            return response()->json(['message' => 'Password reset successfully']);
        } else {
            Log::warning('Password update failed for admin', ['admin_id' => $admin->id]);
            return response()->json(['message' => 'Password reset failed'], 500);
        }
    }

    public function findUsername(Request $request)
    {
        // Validate the username input
        $request->validate([
            'username' => 'required|string',
        ]);

        $admin = Admin::where('username', $request->username)->first();

        if ($admin) {
            return response()->json(['exists' => true], 200);
        }

        return response()->json(['exists' => false], 404);
    }
    public function verifySecurity(Request $request)
    {
        // Validate the request
        $request->validate([
            'username' => 'required|string',
            'security_question' => 'required|string',
            'security_answer' => 'required|string',
        ]);

        // Retrieve the admin using the username
        $admin = Admin::where('username', $request->username)->first();

        if (!$admin) {
            return response()->json(['valid' => false], 404);
        }

        // Check if the security question matches
        if ($admin->security_question !== $request->security_question) {
            return response()->json(['valid' => false], 400);
        }

        // Verify the provided security answer against the stored hash
        $isMatch = Hash::check($request->security_answer, $admin->security_answer);

        if ($isMatch) {
            return response()->json(['valid' => true], 200);
        }

        return response()->json(['valid' => false], 400);
    }
    public function updatePassword(Request $request)
    {
        // Validate the request
        $request->validate([
            'username' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed', // Make sure 'new_password_confirmation' is provided
        ]);
    
        // Log the incoming request data (use caution with sensitive data)
        Log::info('Password update request received', [
            'username' => $request->username,
            'new_password' => '*****' // Don't log the actual password, just mask it
        ]);
    
        // Retrieve the admin using the username
        $admin = Admin::where('username', $request->username)->first();
    
        if (!$admin) {
            // Log the failure to find the admin
            Log::warning('Admin not found', ['username' => $request->username]);
            return response()->json(['error' => 'Admin not found'], 404);
        }
    
        // Log the successful retrieval of the admin
        Log::info('Admin found', ['username' => $request->username]);
    
        // Hash the new password
        $hashedPassword = Hash::make($request->new_password);
    
        // Log the password hash (optional, but typically sensitive, so avoid logging it)
        Log::debug('Password hashed', ['username' => $request->username]);
    
        // Update the admin's password in the database
        $admin->update(['password' => $hashedPassword]);
    
        // Log the successful password update
        Log::info('Password updated successfully', ['username' => $request->username]);
    
        return response()->json(['message' => 'Password updated successfully.'], 200);
    }
};
