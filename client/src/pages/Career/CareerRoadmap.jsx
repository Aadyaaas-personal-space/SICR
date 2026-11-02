
import { useEffect, useMemo, useState } from "react";
import "./CareerRoadmap.css";

const API_URL = "http://localhost:5000/api/roadmap";

function CareerRoadmap() {
    const [careers, setCareers] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCareer, setSelectedCareer] = useState(null);

    useEffect(() => {
        const fetchCareers = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/careers`);

                if (!response.ok) {
                    throw new Error("Unable to load career roadmaps.");
                }

                const data = await response.json();

                // Support either an array or an object containing careers.
                const careerList = Array.isArray(data)
                    ? data
                    : data.careers || data.data || [];

                setCareers(careerList);
            } catch (err) {
                setError(
                    "Could not connect to the Career Roadmap API. Please check that the SICR backend is running."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCareers();
    }, []);

    const categories = useMemo(
        () => [
            "All",
            ...new Set(careers.map((career) => career.category).filter(Boolean)),
        ],
        [careers]
    );

    const filteredCareers = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return careers.filter((career) => {
            const matchesCategory =
                category === "All" || career.category === category;

            const matchesSearch = [
                career.name,
                career.desc,
                career.category,
                ...(career.skills || []),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(keyword);

            return matchesCategory && matchesSearch;
        });
    }, [careers, search, category]);

    return (
        <main className="career-roadmap-page">
            <section className="career-hero">
                <span className="career-eyebrow">
                    SICR · CAREER DEVELOPMENT
                </span>

                <h1>Discover your career path.</h1>

                <p>
                    Explore career opportunities, understand the skills you
                    need, and discover the steps to reach your goals.
                </p>

                <div className="career-search">
                    <span aria-hidden="true">⌕</span>
                    <input
                        type="search"
                        placeholder="Search careers, skills or interests..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        aria-label="Search careers"
                    />
                </div>

                <div className="career-stats">
                    <div>
                        <strong>{careers.length}</strong>
                        <span>Career paths</span>
                    </div>
                    <div>
                        <strong>{categories.length - 1}</strong>
                        <span>Categories</span>
                    </div>
                    <div>
                        <strong>Explore</strong>
                        <span>Your next step</span>
                    </div>
                </div>
            </section>

            <section className="career-explorer">
                <div className="career-section-heading">
                    <div>
                        <span className="career-eyebrow">CAREER EXPLORER</span>
                        <h2>Find your direction</h2>
                        <p>
                            Browse available paths and select one to see its
                            roadmap.
                        </p>
                    </div>
                    <span className="career-result-count">
                        {filteredCareers.length} results
                    </span>
                </div>

                <div className="career-categories">
                    {categories.map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={
                                category === item
                                    ? "career-category active"
                                    : "career-category"
                            }
                            onClick={() => setCategory(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {loading && (
                    <div className="career-message">
                        Loading career roadmaps...
                    </div>
                )}

                {!loading && error && (
                    <div className="career-message career-error">
                        {error}
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && filteredCareers.length === 0 && (
                    <div className="career-message">
                        No careers found. Try another search or category.
                    </div>
                )}

                {!loading && !error && filteredCareers.length > 0 && (
                    <div className="career-grid">
                        {filteredCareers.map((career) => (
                            <article className="career-card" key={career.id}>
                                <div className="career-card-top">
                                    <div className="career-icon">
                                        {career.icon || "🎯"}
                                    </div>
                                    <span className="career-card-category">
                                        {career.category || "Career"}
                                    </span>
                                </div>

                                <h3>{career.name}</h3>

                                <p className="career-card-description">
                                    {career.desc ||
                                        "Explore this career path and its opportunities."}
                                </p>

                                {career.skills?.length > 0 && (
                                    <div className="career-skill-tags">
                                        {career.skills
                                            .slice(0, 3)
                                            .map((skill) => (
                                                <span key={skill}>{skill}</span>
                                            ))}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className="career-explore-button"
                                    onClick={() => setSelectedCareer(career)}
                                >
                                    Explore roadmap <span>→</span>
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {selectedCareer && (
                <div
                    className="career-modal-backdrop"
                    onClick={() => setSelectedCareer(null)}
                >
                    <section
                        className="career-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="career-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="career-modal-close"
                            onClick={() => setSelectedCareer(null)}
                            aria-label="Close roadmap"
                        >
                            ×
                        </button>

                        <div className="career-modal-icon">
                            {selectedCareer.icon || "🎯"}
                        </div>

                        <span className="career-eyebrow">
                            {selectedCareer.category || "CAREER ROADMAP"}
                        </span>

                        <h2 id="career-modal-title">
                            {selectedCareer.name}
                        </h2>

                        <p className="career-modal-description">
                            {selectedCareer.desc}
                        </p>

                        <h3>Your roadmap</h3>

                        {selectedCareer.steps?.length > 0 ? (
                            <div className="career-timeline">
                                {selectedCareer.steps.map((step, index) => (
                                    <div
                                        className="career-timeline-item"
                                        key={`${step.stage || "stage"}-${index}`}
                                    >
                                        <div className="career-timeline-number">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4>
                                                {step.stage ||
                                                    `Step ${index + 1}`}
                                            </h4>
                                            <p>
                                                {typeof step === "string"
                                                    ? step
                                                    : step.text ||
                                                      step.description ||
                                                      ""}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>
                                A detailed step-by-step roadmap for this career
                                will be added here.
                            </p>
                        )}

                        {selectedCareer.skills?.length > 0 && (
                            <>
                                <h3>Skills to develop</h3>
                                <div className="career-skill-tags career-modal-skills">
                                    {selectedCareer.skills.map((skill) => (
                                        <span key={skill}>{skill}</span>
                                    ))}
                                </div>
                            </>
                        )}

                        {selectedCareer.startup && (
                            <>
                                <h3>Entrepreneurship opportunities</h3>
                                <p>{selectedCareer.startup}</p>
                            </>
                        )}
                    </section>
                </div>
            )}
        </main>
    );
}

export default CareerRoadmap;
