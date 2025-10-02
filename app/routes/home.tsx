import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {gsap} from "gsap";
import resume from "~/routes/resume";
import SectionHeader from "~/components/SectionHeader";
import EmptyState from "~/components/EmptyState";
import ResumeCardSkeleton from "~/components/ResumeCardSkeleton";
import Modal from "~/components/Modal";

export function meta({}: Route.MetaArgs) {
  return [
	{ title: "Resumlyzer" },
	{ name: "description", content: "Smart feedback for your Resume!" },
  ];
}

export default function Home() {
  // auth, kv states are defined in the usePuterStore() which is in the puter.ts file
  const {auth, kv} = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  const scope = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
        if(!scope.current){
			return;
		}

		const ctx = gsap.context(() => {
			gsap.to("[data-hero]", {
				y: 16,
				duration: 0.6,
				ease: "power2.inOut",
			});
		}, scope);

		return () => ctx.revert();
	}, [resume.length]);

    useEffect(() => {
        if(!scope.current){
            return;
        }

        const ctx = gsap.context(() => {
            gsap.from("[data-card]", {
                y: 20,
                autoAlpha: 0,
                duration: 0.5,
                stagger: 0.06,
                ease: "power2.inOut",
            })
        }, scope);

        return () => ctx.revert();
    }, [resume.length]);

  useEffect(() => {
	if(!auth.isAuthenticated){
	  navigate('/auth?next=/');
	}
  }, [auth.isAuthenticated]);

  // This is for parsing the resumes which were previously checked in the site
  useEffect(() => {
	const loadResumes = async() => {
	  setLoadingResumes(true);

	  const resumes = (await kv.list('resume:*', true)) as KVItem[];

	  const parsedResumes = resumes ?.map((resume) => (
		  JSON.parse(resume.value) as Resume
	  ))
	  setResumes(parsedResumes || []);
	  setLoadingResumes(false)
	}

	loadResumes();
  }, []);

  return (
	<main ref={scope}>
	<Navbar/>
	<section className="main-section">
        <SectionHeader
            eyebrow="AI-Powered Analysis"
            title={
                <h1 className="text-gradient">
                    Analyze Your Resume in Seconds
                </h1>
            }
            description="Upload your resume to get instant feedback on your skills, experience, and qualifications. Our AI-powered analysis ensures that you receive accurate and actionable insights."
        />
	  <div className="page-heading py-5" data-hero>
		{/*{!loadingResumes && resumes ?.length === 0 ? (*/}
		{/*	<h2>No resumes found. upload your first resume to get feedback.</h2>*/}
		{/*) : (*/}
		{/*	<h2>Review your submissions and check AI-powered feedback.</h2>*/}
		{/*)}*/}
          {!loadingResumes && resumes.length > 0 && <h2>Review your submissions and check AI-powered feedback.</h2>}
	  </div>

	  {loadingResumes && (
		  // <div className="flex flex-col items-center justify-center">
			// <img src={"/images/resume-scan-2.gif"} className="w-[200px]" />
		  // </div>
          <div className="resume-section">
              {/* Display 3 skeleton cards as placeholders */}
              {[...Array(3)].map((_, i) => <ResumeCardSkeleton key={i}/>)}
          </div>
	  )}

	  {/*resumes is coming from index.ts*/}
	  {!loadingResumes && resumes.length > 0 && (
		  <div className="resumes-section">
			{resumes.map((resume) => (
				// <ResumeCard key={resume.id} resume={resume} data-card/>
                <ResumeCard
                    key={resume.id}
                    resume={resume}
                    onClick={() => setSelectedResume(resume)}
                    data-card
                />
			))}
		  </div>
	  )}

	  {!loadingResumes && resumes.length === 0 && (
		  // <div className="flex flex-col items-center justify-center mt-10 gap-4">
			// <Link to="/upload" className="primary-button w-fit text-xl font-semibold z-10">
			//   Upload Resume
			// </Link>
		  // </div>
          <EmptyState
              icon={<img src="/images/resume-scan-2.gif" alt="scanning animation" className="w-40 h-40" />}
              message={<h2>No resumes found. Upload your first resume to get started.</h2>}
              cta={
                  <Link
                      to="/upload"
                      className="primary-button w-fit text-xl font-semibold z-10"
                  >
                      Upload Resume
                  </Link>
              }
          />
	  )}
	</section>
    <Modal isOpen={!!selectedResume} onClose={() => setSelectedResume(null)}>
        {selectedResume && (
            <div className="resume-quick-view">
                <h2>{selectedResume.jobTitle || "Resume Quick View"}</h2>
                <p className="text-[var(--color-muted)]">
                    {selectedResume.companyName ? `For: ${selectedResume.companyName}` : "General Resume"}
                </p>

                <div className="mt-4 flex gap-4">
                    <Link
                        to={`/resume/${selectedResume.id}`}
                        className="primary-button w-fit"
                        onClick={() => setSelectedResume(null)}
                    >
                        View Full Analysis
                    </Link>
                </div>
            </div>
        )}
    </Modal>
  </main>
  );
}
