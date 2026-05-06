import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { Navigate, useNavigate, useParams } from 'react-router'
import ResumeChangeItem from '../pages/ResumeChangeItem.jsx'


const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
    {
        id: 'evaluation',
        label: 'Tailored Resume',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* Bulb */}
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2a7 7 0 0 0-4 12c.5.5 1 1.5 1 2h6c0-.5.5-1.5 1-2a7 7 0 0 0-4-12z" />

                {/* Filament */}
                <path d="M9.5 11a2.5 2.5 0 0 1 5 0" />

                {/* Glow rays */}
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
        )
    }]

const Section = ({ title, color, bg, children, isOpen, onToggle }) => {
    return (
        <div
            style={{
                marginBottom: "16px",
                borderRadius: "12px",
                border: `1px solid ${color}33`,
                background: bg,
            }}
        >
            {/* HEADER */}
            <div
                onClick={onToggle}
                style={{
                    cursor: "pointer",
                    padding: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color,
                    fontWeight: "600",
                }}
            >
                <span>{title}</span>
                <span style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "0.2s" }}>
                    ▶
                </span>
            </div>

            {/* CONTENT */}
            {isOpen && <div style={{ padding: "0 12px 12px 12px" }}>{children}</div>}
        </div>
    );
};

const itemStyle = {
    border: "1px solid #374151",
    borderRadius: "8px",
    padding: "8px",
    marginBottom: "6px",
    lineHeight: "1.5",
    fontSize:"0.9rem"
};

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const [openSection, setOpenSection] = useState({
        matches: true,
        gaps: false,
    });

    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])



    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    const toggle = (key) => {
        setOpenSection((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'

    // console.log(report);

    return (
        <div className='interview-page'>
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" , marginBottom:"0.5rem" }}>

                            <p className='interview-nav__label'>Sections</p>
                            {/* <button style={{ marginBottom: "10px", fontSize: "0.7rem", cursor: "pointer" }} > */}
                            <div
                                onClick={() => navigate("/")}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    fontSize: "0.8rem",
                                    cursor: "pointer",
                                    color: "#e5e7eb",
                                    userSelect: "none",
                                }}
                            >
                                {/* ICON WRAPPER */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "18px",
                                        height: "18px",
                                        backgroundColor: "lightblue",
                                        borderRadius: "50%",
                                        color: "blue",
                                        flexShrink: 0,
                                        marginBottom: "8px"
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M14 6L8 12L14 18" />
                                    </svg>
                                </div>

                                <span style={{
                                    fontSize: "0.8rem", marginBottom: "9px"
                                }}>Go back</span>
                            </div>
                            {/* </button> */}
                        </div>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    {/* <button
                        onClick={() => { getResumePdf(interviewId) }}
                        className='button primary-button' >
                        <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        Download Resume
                    </button> */}
                </nav>

                <div className='interview-divider' />
                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{report.technicalQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{report.behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{report.preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'evaluation' && (
                        <section>
                            <div className='content-header'>
                                <h2>Resume Insights and Suggestions</h2>
                                {/* <span className='content-header__count'>{report.preparationPlan.length}-day plan</span> */}
                            </div>

                            <div style={{ fontFamily: "sans-serif", padding: "16px", color: "#e5e7eb" }}>

                                {/* MATCHES */}
                                <Section
                                    title="Matches"
                                    color="#22c55e"
                                    bg="rgba(34,197,94,0.08)"
                                    isOpen={openSection.matches}
                                    onToggle={() => toggle("matches")}
                                >
                                    {report.fit.matches.map((item, idx) => (
                                        <div key={idx} style={itemStyle}>
                                            {item}
                                        </div>
                                    ))}
                                </Section>

                                {/* GAPS */}
                                <Section
                                    title="Gaps"
                                    color="#f87171"
                                    bg="rgba(248,113,113,0.08)"
                                    isOpen={openSection.gaps}
                                    onToggle={() => toggle("gaps")}
                                >
                                    {report.fit.gaps.map((item, idx) => (
                                        <div key={idx} style={itemStyle}>
                                            {item}
                                        </div>
                                    ))}
                                </Section>

                                {/* RESUME IMPROVEMENTS */}
                                <div style={{ marginTop: "20px" }}>
                                    <h3 style={{ marginBottom: "12px" }}>Resume Improvements</h3>

                                    {report.resumeChanges.map((change, idx) => (
                                        <ResumeChangeItem key={idx} change={change} />
                                    ))}
                                </div>
                            </div>


                        </section>
                    )}


                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* Match Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub' style={{ color: report.decision === "APPLY" ? "green" : "red" }}>Decision : {report.decision}</p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Critical Gaps */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Critical Gaps</p>
                        <div className='skill-gaps__list'>
                            {report.criticalGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--high`}>
                                    {gap}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview