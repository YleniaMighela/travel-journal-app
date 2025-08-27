import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

function PostCard() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .eq("id", id)
                .single();

            if (error) console.error("Errore fetch:", error);
            else setPost(data);

            setLoading(false);
        };

        fetchPost();
    }, [id]);

    if (loading) return <p>Caricamento...</p>;
    if (!post) return <p>Post non trovato.</p>;

    return (
        <div className="post-detail">
            <Link to="/">← Torna alla lista</Link>
            <h2>{post.title}</h2>
            <p><strong>Luogo:</strong> {post.location}</p>
            <p><strong>Descrizione:</strong> {post.description}</p>
            <p><strong>Stato d’animo:</strong> {post.mood}</p>
            <p><strong>Spesa:</strong> €{post.expense}</p>
            <p><strong>Riflessione positiva:</strong> {post.reflection_positive}</p>
            <p><strong>Riflessione negativa:</strong> {post.reflection_negative}</p>
            <p><strong>Impegno fisico:</strong> {post.physical_effort} / 5</p>
            <p><strong>Impegno economico:</strong> {post.economic_effort} / 5</p>
            {post.tags && post.tags.length > 0 && (
                <p><strong>Tags:</strong> {post.tags.join(", ")}</p>
            )}
            {post.media_urls && post.media_urls.length > 0 && (
                <div className="media-container">
                    {post.media_urls.map((url, idx) =>
                        url.endsWith(".mp4") ? (
                            <video key={idx} src={url} controls width="100%" />
                        ) : (
                            <img key={idx} src={url} alt="media" className="post-image" />
                        )
                    )}
                </div>
            )}
        </div>
    );
}

export default PostCard;
