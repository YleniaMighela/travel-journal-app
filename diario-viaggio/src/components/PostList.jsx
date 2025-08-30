import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import PostFilter from "./PostFilter";

function PostList() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) console.error("Errore fetch:", error);
            else {
                setPosts(data);
                setFilteredPosts(data);
            }

            setLoading(false);
        };

        fetchPosts();
    }, []);

    // Aggiorna i post filtrati in base ai valori ricevuti da PostFilter
    const handleFilterChange = ({ searchText, mood }) => {
        let tempPosts = [...posts];

        if (searchText) {
            const text = searchText.toLowerCase();
            tempPosts = tempPosts.filter(
                (p) =>
                    p.title.toLowerCase().includes(text) ||
                    p.location.toLowerCase().includes(text) ||
                    p.description?.toLowerCase().includes(text)
            );
        }

        if (mood) {
            tempPosts = tempPosts.filter((p) => p.mood?.toLowerCase() === mood.toLowerCase());
        }

        setFilteredPosts(tempPosts);
    };

    // Ordina i post filtrati
    const handleSortChange = (sortBy) => {
        const sortedPosts = [...filteredPosts];

        if (sortBy === "expense") sortedPosts.sort((a, b) => a.expense - b.expense);
        if (sortBy === "created_at") sortedPosts.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        if (sortBy === "physical_effort") sortedPosts.sort((a, b) => b.physical_effort - a.physical_effort);

        setFilteredPosts(sortedPosts);
    };

    if (loading) return <p>Caricamento...</p>;

    return (
        <div className="postlist-container">
            <h4>Lista tappe</h4>

            <PostFilter
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
            />

            {filteredPosts.length === 0 ? (
                <p className="mex">Nessun post trovato.</p>
            ) : (
                <div className="post-grid">
                    {filteredPosts.map((post) => (
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
