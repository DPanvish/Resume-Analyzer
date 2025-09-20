import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {gsap} from "gsap";
import resume from "~/routes/resume";

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

  const scope = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
        if(!scope.current){
			return;
		}

		const ctx = gsap.context(() => {
			gsap.to("[data-hero]", {
				y: 16,
				autoAlpha: 0,
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
	  <div className="page-heading py-16" data-hero>
		<h1>Track Your Applications & Resume Ratings</h1>
		{!loadingResumes && resumes ?.length === 0 ? (
			<h2>No resumes found. upload your first resume to get feedback.</h2>
		) : (
			<h2>Review your submissions and check AI-powered feedback.</h2>
		)}
	  </div>

	  {loadingResumes && (
		  <div className="flex flex-col items-center justify-center">
			<img src={"/images/resume-scan-2.gif"} className="w-[200px]" />
		  </div>
	  )}

	  {/*resumes is coming from index.ts*/}
	  {!loadingResumes && resumes.length > 0 && (
		  <div className="resumes-section">
			{resumes.map((resume) => (
				<ResumeCard key={resume.id} resume={resume} data-card/>
			))}
		  </div>
	  )}

	  {!loadingResumes && resumes.length === 0 && (
		  <div className="flex flex-col items-center justify-center mt-10 gap-4">
			<Link to="/upload" className="primary-button w-fit text-xl font-semibold z-10">
			  Upload Resume
			</Link>
		  </div>
	  )}
	</section>
  </main>
  );
}
