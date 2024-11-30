<?php

namespace App\Http\Controllers;

use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TempImageController extends Controller
{
    public function store(Request $request) {

        // Apply validation
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Please fix errors',
                'errors' => $validator->errors()
            ]);
        }

        // Access uploaded file
        $image = $request->file('image');
        if (!$image) {
            return response()->json([
                'status' => false,
                'message' => 'No image file provided.',
            ]);
        }

        // Generate unique image name
        $ext = $image->getClientOriginalExtension();
        $imageName = time() . '.' . $ext;

        // Store image info in database
        $tempImage = new TempImage();
        $tempImage->name = $imageName;
        $tempImage->save();

        // Move image to temp directory
        $uploadPath = public_path('uploads/temp');
        if (!file_exists($uploadPath)) {
            mkdir($uploadPath, 0777, true); // Create the directory if it doesn't exist
        }

        if (!$image->move($uploadPath, $imageName)) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to upload image.',
            ]);
        }

        // Return success response
        return response()->json([
            'status' => true,
            'message' => 'Image uploaded successfully',
            'image' => $tempImage
        ]);
    }
}
