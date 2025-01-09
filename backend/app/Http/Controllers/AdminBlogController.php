<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Cloudinary;

class AdminBlogController extends Controller
{
    // Fetch all blogs
    public function index(Request $request)
    {
        $blogs = Blog::orderBy('created_at', 'DESC');

        if (!empty($request->keyword)) {
            $blogs = $blogs->where('title', 'like', '%' . $request->keyword . '%');
        }

        $blogs = $blogs->get();

        return response()->json([
            'status' => true,
            'data' => $blogs,
        ]);
    }

    // Fetch a single blog
    public function show($id)
    {
        $blog = Blog::find($id);

        if ($blog == null) {
            return response()->json([
                'status' => false,
                'message' => 'Blog not found',
            ]);
        }

        $blog['date'] = \Carbon\Carbon::parse($blog->created_at)->format('d M, Y');

        return response()->json([
            'status' => true,
            'data' => $blog,
        ]);
    }

    // Create a new blog
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|min:10',
            'author' => 'required|min:3',
            'shortDesc' => 'required',
            'description' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // Validate uploaded image
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Please fix the errors',
                'errors' => $validator->errors(),
            ]);
        }

        $blog = new Blog();
        $blog->title = $request->title;
        $blog->author = $request->author;
        $blog->shortDesc = $request->shortDesc;
        $blog->description = $request->description;

        // Upload image to Cloudinary if provided
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $uploadResult = cloudinary()->upload($file->getRealPath(), [
                'folder' => 'blogs',
            ]);
            $blog->image = $uploadResult->getSecurePath(); // Save Cloudinary URL
            \Log::info('Image uploaded to Cloudinary: ' . $blog->image);
        }

        $blog->save();

        return response()->json([
            'status' => true,
            'message' => 'Blog added successfully',
            'data' => $blog,
        ]);
    }

    // Update an existing blog
    public function update($id, Request $request)
    {
        $blog = Blog::find($id);

        if ($blog == null) {
            return response()->json([
                'status' => false,
                'message' => 'Blog not found',
            ]);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|min:10',
            'author' => 'required|min:3',
            'shortDesc' => 'required',
            'description' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Please fix the errors',
                'errors' => $validator->errors(),
            ]);
        }

        $blog->title = $request->title;
        $blog->author = $request->author;
        $blog->description = $request->description;
        $blog->shortDesc = $request->shortDesc;

        // Handle new image upload if provided
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            try {
                // Upload new image to Cloudinary
                $uploadResult = cloudinary()->upload($file->getRealPath(), [
                    'folder' => 'blogs',
                ]);

                // Delete old image if it exists
                if ($blog->image) {
                    $publicId = basename(parse_url($blog->image, PHP_URL_PATH), '.' . pathinfo($blog->image, PATHINFO_EXTENSION));
                    cloudinary()->destroy($publicId);
                }

                $blog->image = $uploadResult->getSecurePath(); // Update with the new URL
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'message' => 'Image upload failed',
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $blog->save();

        return response()->json([
            'status' => true,
            'message' => 'Blog updated successfully',
            'data' => $blog,
        ]);
    }

    // Delete a blog
    public function destroy($id)
    {
        $blog = Blog::find($id);

        if ($blog == null) {
            return response()->json([
                'status' => false,
                'message' => 'Blog not found',
            ]);
        }

        // Delete image from Cloudinary if it exists
        if ($blog->image) {
            try {
                $publicId = basename(parse_url($blog->image, PHP_URL_PATH), '.' . pathinfo($blog->image, PATHINFO_EXTENSION));
                cloudinary()->destroy($publicId);
            } catch (\Exception $e) {
                Log::error('Failed to delete Cloudinary image', ['error' => $e->getMessage()]);
            }
        }

        $blog->delete();

        return response()->json([
            'status' => true,
            'message' => 'Blog deleted successfully',
        ]);
    }
}
