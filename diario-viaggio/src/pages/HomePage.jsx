import { Link } from "react-router-dom";
import PostList from "../components/PostList";

function HomePage() {
    return (
        <>
            <div className="home-header">
                <h1>Diario di viaggio</h1>
                <Link to="/form">➕ Aggiungi tappa</Link>
            </div>
            <PostList />
        </>
    );
}

export default HomePage;
