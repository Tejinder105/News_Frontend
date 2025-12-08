import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Send, Trash2, User as UserIcon } from "lucide-react";
import commentService from "../../Services/commentService";
import Button from "../Ui/Button";

const CommentSection = ({ articleId }) => {
    const { isAuthenticated, loginWithRedirect, user, getAccessTokenSilently } =
        useAuth0();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchComments();
    }, [articleId, page]);

    const fetchComments = async () => {
        try {
            const data = await commentService.getComments(articleId, page);
            if (data && data.data) {
                setComments(data.data.comments);
                setTotalPages(data.data.pages);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            await loginWithRedirect({
                appState: { returnTo: window.location.pathname },
            });
            return;
        }

        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const token = await getAccessTokenSilently();
            await commentService.addComment(
                articleId,
                newComment,
                user.name,
                user.picture,
                token
            );
            setNewComment("");
            fetchComments(); // Refresh list
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?"))
            return;

        try {
            const token = await getAccessTokenSilently();
            await commentService.deleteComment(commentId, token);
            fetchComments();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <div className="mt-8 border-t border-gray-100 pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
                Comments ({comments.length})
            </h3>

            {/* Comment Input */}
            <div className="mb-8">
                {isAuthenticated ? (
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <img
                            src={user.picture}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add to the discussion..."
                                className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none min-h-[100px]"
                            />
                            <div className="flex justify-end mt-2">
                                <Button
                                    type="submit"
                                    disabled={loading || !newComment.trim()}
                                    variant="primary"
                                    size="sm"
                                    iconRight={<Send size={16} />}
                                >
                                    Post Comment
                                </Button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <p className="text-gray-600 mb-4">
                            Join the conversation by logging in.
                        </p>
                        <Button
                            onClick={() =>
                                loginWithRedirect({
                                    appState: {
                                        returnTo: window.location.pathname,
                                    },
                                })
                            }
                            variant="primary"
                        >
                            Log in to Comment
                        </Button>
                    </div>
                )}
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment._id} className="flex gap-4 group">
                        {comment.userImage ? (
                            <img
                                src={comment.userImage}
                                alt={comment.userName}
                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <UserIcon size={20} />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-900">
                                    {comment.userName}
                                </h4>
                                <span className="text-sm text-gray-500">
                                    {new Date(
                                        comment.createdAt
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                {comment.content}
                            </p>
                            {user && user.sub === comment.userId && (
                                <button
                                    onClick={() => handleDelete(comment._id)}
                                    className="mt-2 text-sm text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-red-600"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                        No comments yet. Be the first to share your thoughts!
                    </p>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
