import React, { useEffect, useState } from "react";
import { auth, db, uploadVideo, uploadReel } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

// ✅ URL Validation
const isValidVideoUrl = (url) => {
    if (!url) return false;
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+$/;
    const mp4Regex = /^https?:\/\/.+\.(mp4|webm|ogg)$/i;
    return ytRegex.test(url) || vimeoRegex.test(url) || mp4Regex.test(url);
};
const getEmbedUrl = (url) => {
    if (!url) return "";

    // YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    // MP4/WebM/OGG
    if (url.match(/\.(mp4|webm|ogg)$/i)) return url;

    return url;
};
function Page() {
    const [videos, setVideos] = useState([]);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("video");

    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [uploadType, setUploadType] = useState("video");
    const [editId, setEditId] = useState(null);

    /* ===== LOAD VIDEOS ===== */
    const loadVideos = async () => {
        const videoSnap = await getDocs(collection(db, "videos"));
        const reelSnap = await getDocs(collection(db, "reels"));

        const videoData = videoSnap.docs.map(doc => ({
            id: doc.id,
            type: "video",
            ...doc.data()
        }));
        const reelData = reelSnap.docs.map(doc => ({
            id: doc.id,
            type: "reel",
            ...doc.data()
        }));
        setVideos([...videoData, ...reelData]);
    };

    useEffect(() => {
        loadVideos();
    }, []);

    /* ===== SEARCH FILTER ===== */
    const filteredVideos = videos
        .filter(v => v.type === typeFilter)
        .filter(v =>
            v.title?.toLowerCase().includes(search.toLowerCase()) ||
            v.description?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            const aScore =
                (a.title?.toLowerCase().includes(search.toLowerCase()) ? 2 : 0) +
                (a.description?.toLowerCase().includes(search.toLowerCase()) ? 1 : 0);
            const bScore =
                (b.title?.toLowerCase().includes(search.toLowerCase()) ? 2 : 0) +
                (b.description?.toLowerCase().includes(search.toLowerCase()) ? 1 : 0);
            return bScore - aScore;
        });

    /* ===== UPLOAD / EDIT ===== */
    const handleUpload = async () => {
        if (!url || !title) {
            alert("URL এবং Title দিতে হবে");
            return;
        }
        if (!isValidVideoUrl(url)) {
            alert("Please enter a valid video URL (YouTube, Vimeo, or MP4/WebM/OGG)");
            return;
        }

        const user = auth.currentUser;
        const uploaderName = user?.displayName || "Anonymous";
        const uploaderProfile = user?.photoURL || "/defaultProfile.png";

        const videoData = { url, title, description, uploaderName, uploaderProfile };

        if (editId) {
            const collectionName = uploadType === "video" ? "videos" : "reels";
            const docRef = doc(db, collectionName, editId);
            await updateDoc(docRef, videoData);
            alert("Update Success");
            setEditId(null);
        } else {
            if (uploadType === "video") await uploadVideo(url, title, description, uploaderName, uploaderProfile);
            else await uploadReel(url, title, description, uploaderName, uploaderProfile);
            alert("Upload Success");
        }

        setUrl("");
        setTitle("");
        setDescription("");
        loadVideos();
    };

    /* ===== EDIT VIDEO ===== */
    const handleEdit = (v) => {
        setUrl(v.url);
        setTitle(v.title);
        setDescription(v.description);
        setUploadType(v.type);
        setEditId(v.id);
    };

    return (
        <div style={{ maxWidth: "900px", margin: "auto" }}>
        

            {/* SEARCH */}
            <div style={{ display: "flex", gap: "10px" }}>
                <input
                    placeholder="Search video..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 1, padding: "10px" }}
                />
                <button>Search</button>
            </div>

            {/* TYPE FILTER */}
            <div style={{ marginTop: "10px" }}>
                <button onClick={() => setTypeFilter("video")}>Videos</button>
                <button onClick={() => setTypeFilter("reel")}>Reels</button>
            </div>

            {/* VIDEO LIST */}
            <div style={{ marginTop: "20px" }}>
                {filteredVideos.map(v => (
                    <div key={v.id} style={{ marginBottom: "40px", border: "1px solid #ddd", padding: "15px", borderRadius: "8px" }}>

                        {/* UPLOADER INFO */}
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                            <img
                                src={v.uploaderProfile || "/defaultProfile.png"}
                                alt={v.uploaderName || "Uploader"}
                                style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }}
                            />
                            <strong>{v.uploaderName || "Unknown User"}</strong>
                        </div>

                        {/* VIDEO */}
                        <h3>{v.title}</h3>
                        <iframe
                            width="100%"
                            height={v.type === "reel" ? "500" : "400"}
                            src={getEmbedUrl(v.url)}
                            title={v.title}
                            frameBorder="0"
                            allowFullScreen
                        />
                        <p>{v.description}</p>
                        <button onClick={() => handleEdit(v)}>Edit</button>
                    </div>
                ))}
            </div>

            {/* UPLOAD / EDIT FORM */}
            <h3>{editId ? "Edit Video/Reel" : "Upload Video/Reel"}</h3>
            <input
                placeholder="Video URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                style={{ padding: "10px" }}
            >
                <option value="video">Video</option>
                <option value="reel">Reel</option>
            </select>
            <br /><br />
            <button onClick={handleUpload}>
                {editId ? "Save Changes" : "Upload"}
            </button>
        </div>
    );
}

export default Page;