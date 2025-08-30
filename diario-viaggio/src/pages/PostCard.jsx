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
            <h2><em className="title_card">{post.title}</em></h2>
            <p><strong>Luogo:</strong> <em>{post.location}</em></p>
            <p><strong>Descrizione:</strong> <em>{post.description}</em></p>
            <p><strong>Stato d’animo:</strong> <em>{post.mood}</em></p>
            <p><strong>Spesa:</strong> <em>€{post.expense}</em></p>
            <p><strong>Riflessione positiva:</strong> <em>{post.reflection_positive}</em></p>
            <p><strong>Riflessione negativa:</strong> <em>{post.reflection_negative}</em></p>
            <p><strong>Impegno fisico:</strong> <em>{post.physical_effort}</em> / 5</p>
            <p><strong>Impegno economico:</strong> <em>{post.economic_effort}</em> / 5</p>

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
