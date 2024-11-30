<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class AdminBlogController extends Controller
{   
    // This method will return all blogs
    public function index(Request $request) {

        $blogs = Blog::orderBy('created_at', 'DESC');

        if(!empty($request->keyword)){
            $blogs = $blogs->where('title','like','%' .$request->keyword. '%');

        }

        $blogs = $blogs->get();

        return response()->json([
            'status' => true,
            'data' => $blogs
        ]);
    }

    // This method will return a single blog
    public function show($id) {
        $blog = Blog::find($id);
        
        if ($blog == null) {
            return response()->json([
                'status' => false,
                'message' => 'Blog not found'
            ]);
        }  

        $blog['date'] = \Carbon\Carbon::parse($blog->created_at)->format('d M, Y');

        return response()->json([
            'status' => true,
            'data' => $blog
        ]);
    }

    // This method will store a new blog
    public function store(Request $request) {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'title' => 'required|min:10', // Title is required and must be at least 10 characters long
            'author' => 'required|min:3'  // Author is required and must be at least 3 characters long
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Please fix the errors',
                'errors' => $validator->errors()
            ]);
        }

        // Create a new Blog instance and save the data
        $blog = new Blog();
        $blog->title = $request->title;
        $blog->author = $request->author;
        $blog->description = $request->description;
        $blog->shortDesc = $request->shortDesc;
        $blog->save();

        // Save the image if provided
        $tempImage = TempImage::find($request->image_id);

        if ($tempImage != null) {
            // Extract the image extension and create a new image name
            $imageExtArray = explode('.', $tempImage->name);
            $ext = last($imageExtArray);
            $imageName = time() . '-' . $blog->id . '.' . $ext;

            $blog->image = $imageName;
            $blog->save();

            // Define the source and destination paths for the image
            $sourcePath = public_path('uploads/temp/' . $tempImage->name);
            $destPath = public_path('uploads/blogs/' . $imageName);

            // Copy the image from the temporary location to the blog images location
            if (!File::copy($sourcePath, $destPath)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to copy image to destination.'
                ]);
            }
        }

        // Return a success response
        return response()->json([
            'status' => true,
            'message' => 'Blog added successfully',
            'data' => $blog
        ]);
    }

    // This method will update a blog
    public function update($id, Request $request) {
        $blog = Blog::find($id);

        if ($blog == null) {
            return response()->json([
                'status' => false,
                'message' => 'Blog not found'
            ]);
        }

        // Validate the request data
        $validator = Validator::make($request->all(), [
            'title' => 'required|min:10', // Title is required and must be at least 10 characters long
            'author' => 'required|min:3'  // Author is required and must be at least 3 characters long
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Please fix the errors',
                'errors' => $validator->errors()
            ]);
        }

        // Update the Blog instance with the new data
        $blog->title = $request->title;
        $blog->author = $request->author;
        $blog->description = $request->description;
        $blog->shortDesc = $request->shortDesc;
        $blog->save();


        // Save the image if provided
        $tempImage = TempImage::find($request->image_id);

        if ($tempImage != null) {

            // Delete Old Image Here
            File::delete(public_path('uploads/blogs/'. $blog->image));

            $imageExtArray = explode('.', $tempImage->name);
            $ext = last($imageExtArray);
            $imageName = time() . '-' . $blog->id . '.' . $ext;

            $blog->image = $imageName;
            $blog->save();

            // Define the source and destination paths for the image
            $sourcePath = public_path('uploads/temp/' . $tempImage->name);
            $destPath = public_path('uploads/blogs/' . $imageName);

            // Copy the image from the temporary location to the blog images location
            if (!File::copy($sourcePath, $destPath)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Failed to copy image to destination.'
                ]);
            }
        }

        // Return a success response
        return response()->json([
            'status' => true,
            'message' => 'Blog updated successfully',
            'data' => $blog
        ]);
    }

    // This method will delete a blog
    public function destroy($id) {
       
        $blog = Blog::find($id);

        if ($blog == null){
            return response()->json([
                'status' => false,
                'message' => 'Blog not found'
            ]);

        }

        //Delete Blog image First
        File::delete(public_path('uploads/blogs/'.$blog->image));

        //Delete blog from the DB
        $blog->delete();

        return response()->json([
            'status' => true,
            'message' => 'Blog deleted successfully',
        ]);

    }
}
