
const Post = require("../models/Post");


const isPostOwner = (post, identity) => {
    if (!post || !identity || !post.authorId || !identity.id) {
        return false;
    }

    const postType = String(post.authorType || "").toUpperCase();
    const currentType = String(identity.type || "").toUpperCase();

    const postAuthorId = String(post.authorId);
    const currentUserId = String(identity.id);

    return (
        postType === currentType &&
        postAuthorId === currentUserId
    );
};

const createPost = async (req, res) => {
    try {
        const identity = req.connectionIdentity;
        const { content, image } = req.body;

        if (!identity) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const cleanContent = content?.trim() || "";

        if (!cleanContent && !image) {
            return res.status(400).json({
                success: false,
                message: "Post must contain text or an image",
            });
        }

        if (cleanContent.length > 5000) {
            return res.status(400).json({
                success: false,
                message: "Post text cannot exceed 5000 characters",
            });
        }

        const post = await Post.create({
            authorType: identity.type,
            authorId: identity.id,
            content: cleanContent,
            image: image || null,
        });

        const result = post.toObject();
        result.isOwner = true;

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: result,
        });
    } catch (error) {
        console.error("CREATE POST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create post",
        });
    }
};

const getPosts = async (req, res) => {
    try {
        const identity = req.connectionIdentity;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .lean();

        const postsWithOwnership = posts.map((post) => ({
            ...post,
            isOwner: isPostOwner(post, identity),
        }));

        return res.status(200).json({
            success: true,
            count: postsWithOwnership.length,
            posts: postsWithOwnership,
        });
    } catch (error) {
        console.error("GET POSTS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch posts",
        });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).lean();

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        return res.status(200).json({
            success: true,
            post: {
                ...post,
                isOwner: isPostOwner(
                    post,
                    req.connectionIdentity
                ),
            },
        });
    } catch (error) {
        console.error("GET POST ERROR:", error);

        return res.status(400).json({
            success: false,
            message: "Unable to fetch post",
        });
    }
};

/*
 * EDIT POST
 * PATCH /api/posts/:postId
 */
const editPost = async (req, res) => {
    try {
        const identity = req.connectionIdentity;

        if (!identity) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const { content, image } = req.body;
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (!isPostOwner(post, identity)) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to edit this post",
            });
        }

        if (content === undefined && image === undefined) {
            return res.status(400).json({
                success: false,
                message: "Provide post content or image to update",
            });
        }

        const nextContent =
            content === undefined
                ? post.content
                : String(content).trim();

        const nextImage =
            image === undefined
                ? post.image
                : image || null;

        if (!nextContent && !nextImage) {
            return res.status(400).json({
                success: false,
                message: "Post must contain text or an image",
            });
        }

        if (nextContent.length > 5000) {
            return res.status(400).json({
                success: false,
                message: "Post text cannot exceed 5000 characters",
            });
        }

        if (content !== undefined) {
            post.content = nextContent;
        }

        if (image !== undefined) {
            post.image = nextImage;
        }

        await post.save();

        const result = post.toObject();
        result.isOwner = true;

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post: result,
        });
    } catch (error) {
        console.error("EDIT POST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to edit post",
        });
    }
};

/*
 * DELETE POST
 * DELETE /api/posts/:postId
 */
const deletePost = async (req, res) => {
    try {
        const identity = req.connectionIdentity;

        if (!identity) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (!isPostOwner(post, identity)) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this post",
            });
        }

        await post.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        console.error("DELETE POST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete post",
        });
    }
};

/*
 * LIKE / UNLIKE POST
 * PATCH /api/posts/:postId/like
 */
const toggleLike = async (req, res) => {
    try {
        const identity = req.connectionIdentity;

        if (!identity) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        // Kept compatible with your existing likes: [ObjectId] schema.
        const userId = String(identity.id);

        const alreadyLiked = post.likes.some(
            (id) => String(id) === userId
        );

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                (id) => String(id) !== userId
            );
        } else {
            post.likes.push(identity.id);
        }

        await post.save();

        return res.status(200).json({
            success: true,
            liked: !alreadyLiked,
            likesCount: post.likes.length,
        });
    } catch (error) {
        console.error("TOGGLE LIKE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update like",
        });
    }
};

/*
 * ADD COMMENT
 * POST /api/posts/:postId/comments
 */
const addComment = async (req, res) => {
    try {
        const identity = req.connectionIdentity;
        const text = req.body.text?.trim();

        if (!identity) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot be empty",
            });
        }

        if (text.length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot exceed 1000 characters",
            });
        }

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        post.comments.push({
            userType: identity.type,
            userId: identity.id,
            text,
        });

        await post.save();

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comments: post.comments,
        });
    } catch (error) {
        console.error("ADD COMMENT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add comment",
        });
    }
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    editPost,
    deletePost,
    toggleLike,
    addComment,
};
