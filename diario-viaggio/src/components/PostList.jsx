import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) console.error("Errore fetch:", error);
        else setPosts(data);

        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (loading) return <p>Caricamento...</p>;

    return (
        <div className="postlist-container">
            <h4>Lista tappe</h4>
            {posts.length === 0 ? (
                <p>Nessun post trovato.</p>
            ) : (
                <div className="post-grid">
                    {posts.map((post) => (
                        <Link key={post.id} to={`/post/${post.id}`} className="post-card">
                            <h2>{post.title}</h2>
                            <p>{post.location}</p>
                            {post.media_urls && post.media_urls.length > 0 && (
                                <img
                                    src={post.media_urls[0]}
                                    alt={post.title}
                                    className="post-image"
                                />
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PostList;
