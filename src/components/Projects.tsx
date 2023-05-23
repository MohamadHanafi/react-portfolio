import {
  CodeIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/solid";
import { IProject, projects } from "../portfolio/projects.ts";
import { useTranslation } from "react-i18next";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { SyntheticEvent, useEffect, useState } from "react";
import { debounce } from "../helperes/debounce.ts";

const Projects = () => {
  const { t } = useTranslation();
  const [projectsArrays, setProjectsArrays] = useState<IProject[][]>([]);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [currentSlide, setCurrentSlide] = useState<number>(1);

  const BREAK_POINT = 640;

  useEffect(() => {
    const handleResize = debounce(() => setScreenWidth(window.innerWidth), 50);
    window.addEventListener("resize", handleResize);
    console.log(screenWidth);

    // if the screen width is less than the break point, set the number of slides to 2 otherwise 4
    setProjectsArrays(
      projects
        .sort((a, b) => b._id - a._id)
        .reduce((acc: IProject[][], curr, i) => {
          const getDivider = () => (screenWidth > BREAK_POINT ? 4 : 2);
          if (!(i % getDivider())) {
            acc.push([]);
          }
          acc[acc.length - 1].push(curr);

          // if (
          //   i === projects.length - 1 &&
          //   acc[acc.length - 1].length < getDivider()
          // ) {
          //   acc[acc.length - 1].unshift(
          //     ...acc[acc.length - 2].slice(
          //       -(getDivider() - acc[acc.length - 1].length)
          //     )
          //   );
          // }
          return acc;
        }, [])
    );

    return () => window.removeEventListener("resize", handleResize);
  }, [screenWidth]);

  return (
    <section id="projects" className="text-gray-400 bg-gray-900 body-font">
      <div className="container px-5 py-10 mx-auto text-center lg:px-40 md:w-4/5">
        <div className="flex flex-col w-full mb-20">
          <CodeIcon className="mx-auto inline-block w-10 mb-4" />
          <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4 text-white">
            {t("projects.header")}
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            {t(`projects.paragraph`)}
          </p>
        </div>
        <div className="h-full w-full py-4">
          <CarouselProvider
            className="flex"
            naturalSlideWidth={760}
            naturalSlideHeight={524}
            totalSlides={projectsArrays.length}
          >
            {currentSlide > 1 ? (
              <ButtonBack
                onClick={() => {
                  setCurrentSlide(currentSlide - 1);
                }}
              >
                <ArrowLeftIcon className="w-6" />
              </ButtonBack>
            ) : null}
            <Slider className="w-full h-full items-center justify-items-center">
              {projectsArrays.map((projectArray, i) => (
                <Slide
                  key={i}
                  index={i}
                  className="flex flex-wrap -m-4"
                  style={{
                    height: "526px",
                  }}
                >
                  {projectArray.map((project) => (
                    <a
                      href={project.link}
                      key={project.image}
                      style={{ height: "230px" }}
                      className="sm:w-1/2 p-4"
                    >
                      <div className="flex relative">
                        <img
                          style={{
                            height: "230px",
                          }}
                          alt="gallery"
                          className="absolute inset-0 w-full h-full object-cover object-center"
                          src={project.image}
                        />
                        <div
                          style={{ height: "230px" }}
                          className="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100"
                        >
                          <h2 className="tracking-widest text-sm title-font font-medium text-green-400 mb-1">
                            {project.subtitle}
                          </h2>
                          <h1 className="title-font text-lg font-medium text-white mb-3">
                            {project.title}
                          </h1>
                          <p className="leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </Slide>
              ))}
            </Slider>
            {currentSlide < projectsArrays.length && (
              <ButtonNext
                onClick={(
                  ev: SyntheticEvent<HTMLButtonElement, Event> | undefined
                ) => {
                  ev?.preventDefault();
                  setCurrentSlide(currentSlide + 1);
                }}
              >
                <ArrowRightIcon className="w-6" />
              </ButtonNext>
            )}
          </CarouselProvider>
        </div>
        {/* <div className="flex flex-wrap -m-4">
          {projects
            .sort((a, b) => b._id - a._id)
            .map((project) => (
              <a
                href={project.link}
                key={project.image}
                className="sm:w-1/2 p-4 flex-grow"
              >
                <div className="flex relative">
                  <img
                    style={{ height: "230px" }}
                    alt="gallery"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    src={project.image}
                  />
                  <div
                    style={{ height: "230px" }}
                    className="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100"
                  >
                    <h2 className="tracking-widest text-sm title-font font-medium text-green-400 mb-1">
                      {project.subtitle}
                    </h2>
                    <h1 className="title-font text-lg font-medium text-white mb-3">
                      {project.title}
                    </h1>
                    <p className="leading-relaxed">{project.description}</p>
                  </div>
                </div>
              </a>
            ))}
        </div> */}
      </div>
    </section>
  );
};

export default Projects;
