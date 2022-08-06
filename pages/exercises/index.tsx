import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useState } from "react";
import ExercisePreview from "../../components/exercise/ExercisePreview";
import PageLayout from "../../components/layout/PageLayout";
import { IExercise } from "../../model/exercise";
import { getExercises } from "../../utils/contentful";
import slugify from "../../utils/slugify";

export default function ExerciseListPage({
  exercises,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [visibleExercises, setVisibleExercises] =
    useState<IExercise[]>(exercises);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filterLogic = (e: IExercise) => {
    const term = slugify(searchTerm.toLowerCase());
    const name = slugify(e.name.toLowerCase());
    const t = e.tags?.map((e) => slugify(e.toLowerCase()));
    return name.includes(term) || t.some((x) => x.includes(term));
  };

  return (
    <PageLayout widthClassName="max-w-none">
      <h1 className="text-3xl font-bold">Exercises</h1>
      <div>
        <input
          className="px-4 py-1 w-full text-knut-light-text rounded-sm  my-4 border-black border-2"
          type={"text"}
          value={searchTerm}
          placeholder={"zinc exercise"}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div
        className="grid auto-rows-max gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
        }}
      >
        {visibleExercises.filter(filterLogic).map((exercise: IExercise) => (
          <ExercisePreview key={exercise.slug} {...exercise} />
        ))}
      </div>
    </PageLayout>
  );
}

export const getStaticProps: GetStaticProps<{
  exercises: IExercise[];
}> = async () => {
  const exercises = await getExercises();
  return {
    props: {
      exercises: exercises.items.map(({ fields }) => {
        return {
          ...fields,
          imageUrl: `https:${fields.image.fields.file.url}`,
          tags: fields.tags ?? [],
        };
      }),
    },
    revalidate: 600,
  };
};
