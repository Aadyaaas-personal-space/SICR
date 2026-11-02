
import { useEffect, useState } from "react";
import {
  addComment,
  createPost,
  deletePost,
  editPost,
  getPosts,
  toggleLike,
} from "../../services/postService";

import "./Posts.css";

const ECOSYSTEM_LABELS = {
  STARTUP: "Startup",
  INVESTOR: "Investor / Funder",
  MENTOR: "Mentor",
  CORPORATE: "Corporate",
  PARTNERSHIP: "Partnership",
  SPONSORSHIP: "Sponsorship",
  TBRIDGE: "T-Bridge",
};

const getEcosystemLabel = (type) =>
  ECOSYSTEM_LABELS[String(type || "").toUpperCase()] ||
  "SICR Member";

const getAuthorName = (post) => {
  // Use a name if the backend provides one.
  if (post.authorName?.trim()) return post.authorName;
  if (post.author?.name?.trim()) return post.author.name;

  // Until ecosystem profile lookup is connected, avoid
  // incorrectly showing "Startup" as every author's name.
  return getEcosystemLabel(post.authorType);
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [commentText, setCommentText] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [busyPostId, setBusyPostId] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPosts();
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setSuccess("");

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setImagePreview(null);

    const input = document.getElementById("post-image-input");
    if (input) input.value = "";
  };

  const handleCreatePost = async () => {
    if (!content.trim() && !imagePreview) {
      setError("Write something or select an image.");
      return;
    }

    try {
      setPosting(true);
      setError("");
      setSuccess("");

      const data = await createPost({
        content: content.trim(),
        image: imagePreview || null,
      });

      setPosts((current) => [
        { ...data.post, isOwner: true },
        ...current,
      ]);

      setContent("");
      removeSelectedImage();
      setSuccess("Your post was published successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      setError("");

      const data = await toggleLike(postId);

      setPosts((current) =>
        current.map((post) =>
          post._id === postId
            ? {
                ...post,
                likesCount: data.likesCount,
                currentUserLiked: data.liked,
              }
            : post
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update like");
    }
  };

  const startEditing = (post) => {
    setEditingPostId(post._id);
    setEditContent(post.content || "");
    setError("");
    setSuccess("");
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditContent("");
  };

  const handleEditPost = async (postId) => {
    if (!editContent.trim()) {
      setError("Post content cannot be empty.");
      return;
    }

    try {
      setSavingEdit(true);
      setError("");
      setSuccess("");

      const data = await editPost(postId, {
        content: editContent.trim(),
      });

      setPosts((current) =>
        current.map((post) =>
          post._id === postId
            ? {
                ...post,
                ...data.post,
                isOwner: true,
              }
            : post
        )
      );

      cancelEditing();
      setSuccess("Your post was updated successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to edit post");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (post) => {
    if (!post.isOwner) {
      setError("You can only delete your own posts.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      setBusyPostId(post._id);
      setError("");
      setSuccess("");

      await deletePost(post._id);

      setPosts((current) =>
        current.filter((item) => item._id !== post._id)
      );

      setSuccess("Post deleted successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete post");
    } finally {
      setBusyPostId(null);
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId]?.trim();

    if (!text) return;

    try {
      setError("");

      const data = await addComment(postId, text);

      setPosts((current) =>
        current.map((post) =>
          post._id === postId
            ? { ...post, comments: data.comments }
            : post
        )
      );

      setCommentText((current) => ({
        ...current,
        [postId]: "",
      }));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add comment");
    }
  };

  const toggleComments = (postId) => {
    setOpenComments((current) => ({
      ...current,
      [postId]: !current[postId],
    }));
  };

  const formatDate = (date) => {
    if (!date) return "";

    const postDate = new Date(date);
    if (Number.isNaN(postDate.getTime())) return "";

    const difference = Math.floor(
      (Date.now() - postDate.getTime()) / 1000
    );

    if (difference < 60) return "Just now";
    if (difference < 3600) return `${Math.floor(difference / 60)}m`;
    if (difference < 86400) return `${Math.floor(difference / 3600)}h`;
    if (difference < 604800) return `${Math.floor(difference / 86400)}d`;

    return postDate.toLocaleDateString();
  };

  const getInitial = (name, type) => {
    const value = name || getEcosystemLabel(type);
    return value.trim().charAt(0).toUpperCase() || "S";
  };

  return (
    <div className="posts-page">
      <div className="posts-container">
        <div className="posts-header">
          <div>
            <h1>Posts</h1>
            <p>
              Share updates, ideas, achievements and opportunities
              with the SICR ecosystem.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={loadPosts}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>

        {error && (
          <div className="post-alert" role="alert">
            {error}
            <button onClick={() => setError("")} aria-label="Dismiss error">
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="post-alert" role="status">
            {success}
            <button
              onClick={() => setSuccess("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* CREATE POST */}
        <div className="create-post-card">
          <div className="create-post-title">
            <div className="post-avatar">S</div>

            <div>
              <strong>Create a post</strong>
              <span>Share something with the SICR community</span>
            </div>
          </div>

          <textarea
            className="post-textarea"
            placeholder="Share an update, idea or opportunity..."
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={5000}
          />

          {imagePreview && (
            <div className="selected-image-wrapper">
              <img
                src={imagePreview}
                alt="Selected post preview"
                className="selected-image"
              />

              <button
                type="button"
                className="remove-image-button"
                onClick={removeSelectedImage}
                aria-label="Remove selected image"
              >
                ×
              </button>
            </div>
          )}

          <div className="create-post-footer">
            <label
              htmlFor="post-image-input"
              className="image-upload-button"
            >
              🖼️ Add Image
            </label>

            <input
              id="post-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />

            <span className="character-count">
              {content.length}/5000
            </span>

            <button
              className="publish-button"
              onClick={handleCreatePost}
              disabled={posting}
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>

        {/* SHARED FEED */}
        <div className="feed-section">
          {loading ? (
            <div className="loading-card">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="empty-posts">
              <div className="empty-icon">📝</div>
              <h3>No posts yet</h3>
              <p>Be the first SICR member to share something.</p>
            </div>
          ) : (
            posts.map((post) => {
              const authorName = getAuthorName(post);
              const ecosystem = getEcosystemLabel(post.authorType);
              const comments = post.comments || [];
              const likesCount =
                post.likesCount ?? post.likes?.length ?? 0;

              return (
                <div className="post-card" key={post._id}>
                  <div className="post-top">
                    <div className="post-author">
                      <div className="author-avatar">
                        {getInitial(authorName, post.authorType)}
                      </div>

                      <div className="author-info">
                        <strong>{authorName}</strong>
                        <span>
                          {ecosystem} · {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>

                    {post.isOwner && (
                      <div className="post-owner-actions">
                        {editingPostId !== post._id && (
                          <>
                            <button
                              type="button"
                              className="post-menu-button"
                              onClick={() => startEditing(post)}
                              aria-label="Edit post"
                              title="Edit post"
                            >
                              ✎ Edit
                            </button>

                            <button
                              type="button"
                              className="post-menu-button"
                              onClick={() => handleDelete(post)}
                              disabled={busyPostId === post._id}
                              aria-label="Delete post"
                              title="Delete post"
                            >
                              {busyPostId === post._id
                                ? "Deleting..."
                                : "⋯ Delete"}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {editingPostId === post._id ? (
                    <div className="post-edit-form">
                      <textarea
                        className="post-textarea"
                        value={editContent}
                        onChange={(event) =>
                          setEditContent(event.target.value)
                        }
                        maxLength={5000}
                        placeholder="Edit your post..."
                      />

                      <div className="create-post-footer">
                        <span className="character-count">
                          {editContent.length}/5000
                        </span>

                        <button
                          type="button"
                          className="refresh-button"
                          onClick={cancelEditing}
                          disabled={savingEdit}
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          className="publish-button"
                          onClick={() => handleEditPost(post._id)}
                          disabled={savingEdit}
                        >
                          {savingEdit ? "Saving..." : "Save changes"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    post.content && (
                      <div className="post-content">{post.content}</div>
                    )
                  )}

                  {post.image && (
                    <div className="post-image-container">
                      <img
                        src={post.image}
                        alt="Post attachment"
                        className="post-image"
                      />
                    </div>
                  )}

                  <div className="post-stats">
                    <span>❤️ {likesCount} likes</span>
                    <span>{comments.length} comments</span>
                  </div>

                  <div className="post-actions">
                    <button onClick={() => handleLike(post._id)}>
                      ❤️ Like
                    </button>

                    <button onClick={() => toggleComments(post._id)}>
                      💬 Comment
                    </button>
                  </div>

                  {openComments[post._id] && (
                    <div className="comments-section">
                      <div className="comments-list">
                        {comments.length === 0 ? (
                          <p className="no-comments">No comments yet.</p>
                        ) : (
                          comments.map((comment, index) => {
                            const commentName =
                              comment.userName ||
                              comment.authorName ||
                              getEcosystemLabel(comment.userType);

                            return (
                              <div
                                className="comment-item"
                                key={comment._id || index}
                              >
                                <div className="comment-avatar">
                                  {getInitial(
                                    commentName,
                                    comment.userType
                                  )}
                                </div>

                                <div className="comment-body">
                                  <strong>{commentName}</strong>
                                  <p>{comment.text}</p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      <div className="comment-input-wrapper">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentText[post._id] || ""}
                          maxLength={1000}
                          onChange={(event) =>
                            setCommentText((current) => ({
                              ...current,
                              [post._id]: event.target.value,
                            }))
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleComment(post._id);
                            }
                          }}
                        />

                        <button onClick={() => handleComment(post._id)}>
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;
