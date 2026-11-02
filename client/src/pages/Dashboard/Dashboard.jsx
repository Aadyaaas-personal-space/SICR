function Dashboard() {
    return (
        <div className="bg-light min-vh-100 py-4">
            <div className="container">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="fw-semibold text-dark mb-1">
                            SICR Dashboard
                        </h1>
                        <p className="text-secondary mb-0">
                            Dashboard will be developed here.
                        </p>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="row g-4">

                    {/* Main Card */}
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4 p-md-5">

                                <div className="d-flex align-items-center mb-4">
                                    <div
                                        className="bg-light border rounded-3 d-flex align-items-center justify-content-center me-3"
                                        style={{
                                            width: "52px",
                                            height: "52px",
                                        }}
                                    >
                                        <span className="fs-4">📊</span>
                                    </div>

                                    <div>
                                        <h5 className="fw-semibold mb-1">
                                            Welcome to SICR
                                        </h5>

                                        <p className="text-secondary mb-0">
                                            Your centralized platform dashboard
                                        </p>
                                    </div>
                                </div>

                                <div className="border-top pt-4">
                                    <p className="text-secondary mb-0">
                                        Dashboard will be developed here.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Placeholder Cards */}
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <small className="text-uppercase text-secondary fw-semibold">
                                    Overview
                                </small>

                                <h5 className="fw-semibold mt-2 mb-2">
                                    Ecosystem
                                </h5>

                                <p className="text-secondary small mb-0">
                                    Manage your SICR ecosystem activities from one place.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <small className="text-uppercase text-secondary fw-semibold">
                                    Connections
                                </small>

                                <h5 className="fw-semibold mt-2 mb-2">
                                    Network
                                </h5>

                                <p className="text-secondary small mb-0">
                                    Connect with participants across the SICR ecosystem.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <small className="text-uppercase text-secondary fw-semibold">
                                    Opportunities
                                </small>

                                <h5 className="fw-semibold mt-2 mb-2">
                                    Discover
                                </h5>

                                <p className="text-secondary small mb-0">
                                    Explore opportunities, collaboration and growth.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;