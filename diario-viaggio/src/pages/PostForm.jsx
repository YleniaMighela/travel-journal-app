import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function PostForm({ onPostCreated }) {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [mood, setMood] = useState("");
    const [expense, setExpense] = useState("");
    const [positiveReflection, setPositiveReflection] = useState("");
    const [negativeReflection, setNegativeReflection] = useState("");
    const [physicalEffort, setPhysicalEffort] = useState(1);
    const [economicEffort, setEconomicEffort] = useState(1);
    const [tags, setTags] = useState("");
    const [files, setFiles] = useState([]);
    const [fileUrls, setFileUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        let media_urls = [];

        // Upload dei file dal computer
        for (let file of files) {
            const fileName = `${Date.now()}_${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from("media")
                .upload(fileName, file);

            if (uploadError) {
                console.error("Errore upload:", uploadError);
                setErrorMsg("Errore durante l'upload di un file.");
            } else {
                const { data: publicData } = supabase.storage
                    .from("media")
                    .getPublicUrl(fileName);

                if (publicData) {
                    media_urls.push(publicData.publicUrl);
                }
            }
        }

        // Aggiungi URL da internet
        fileUrls.forEach((url) => {
            if (url.trim() !== "") media_urls.push(url.trim());
        });

        // Inserimento post su Supabase
        const { error } = await supabase.from("posts").insert([
            {
                title,
                location,
                description,
                mood,
                expense: parseFloat(expense),
                media_urls,
                reflection_positive: positiveReflection,
                reflection_negative: negativeReflection,
                physical_effort: parseInt(physicalEffort),
                economic_effort: parseInt(economicEffort),
                tags: tags.split(",").map((t) => t.trim()),
            },
        ]);

        if (error) {
            console.error("Errore inserimento:", error);
            setErrorMsg("Errore durante il salvataggio del post.");
        } else {
            // Reset form
            setTitle("");
            setLocation("");
            setDescription("");
            setMood("");
            setExpense("");
            setPositiveReflection("");
            setNegativeReflection("");
            setPhysicalEffort(1);
            setEconomicEffort(1);
            setTags("");
            setFiles([]);
            setFileUrls([]);

            if (onPostCreated) onPostCreated();

            // Redirect automatico alla Home
            navigate("/");
        }

        setLoading(false);
    };

    const addUrlField = () => setFileUrls([...fileUrls, ""]);
    const updateUrl = (index, value) => {
        const newUrls = [...fileUrls];
        newUrls[index] = value;
        setFileUrls(newUrls);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Nuovo Post</h2>

            {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

            <input
                type="text"
                placeholder="Titolo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Luogo"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
            />
            <textarea
                placeholder="Descrizione"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Stato d'animo"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Spesa (€)"
                value={expense}
                onChange={(e) => setExpense(e.target.value)}
                required
                min="0"
                step="0.01"
            />

            <textarea
                placeholder="Riflessione positiva"
                value={positiveReflection}
                onChange={(e) => setPositiveReflection(e.target.value)}
            />
            <textarea
                placeholder="Riflessione negativa"
                value={negativeReflection}
                onChange={(e) => setNegativeReflection(e.target.value)}
            />

            <label>Impegno fisico:</label>
            <select
                value={physicalEffort}
                onChange={(e) => setPhysicalEffort(e.target.value)}
            >
                {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                        {n}
                    </option>
                ))}
            </select>

            <label>Impegno economico:</label>
            <select
                value={economicEffort}
                onChange={(e) => setEconomicEffort(e.target.value)}
            >
                {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                        {n}
                    </option>
                ))}
            </select>

            <input
                type="text"
                placeholder="Tags (separati da virgola)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />

            <div>
                <label>Carica file dal computer:</label>
                <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles([...e.target.files])}
                />
            </div>

            <div>
                <label>Aggiungi URL da internet:</label>
                {fileUrls.map((url, idx) => (
                    <input
                        key={idx}
                        type="text"
                        placeholder="URL immagine/video"
                        value={url}
                        onChange={(e) => updateUrl(idx, e.target.value)}
                    />
                ))}
                <button type="button" onClick={addUrlField}>
                    + Aggiungi un URL
                </button>
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salva Post"}
            </button>
        </form>
    );
}
