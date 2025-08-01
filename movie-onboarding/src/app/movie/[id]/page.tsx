import Recommend from "@/components/recommend";
import Seen from "@/components/seen";
import { auth } from '@clerk/nextjs/server';


export async function generateStaticParams() {
  return Array.from({ length: 250 }, (_, i) => ({
    id: i.toString(),
  }));
}

async function getMovie(id: string) {
  const res = await fetch(`https://jumboboxd.soylemez.net/api/movie?id=${id}`);
  if (!res.ok) throw new Error('Movie not found');
  return res.json();
}

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const movie = await getMovie(id);
  const { userId } = await auth();
  return (
      <div className="flex flex-row p-4">
        <img src={movie.poster} width="300" height="450" alt={`${movie.title} poster`} />
        <div className="flex flex-col items-start">
          <h1 className="text-2xl font-bold">{movie.title}</h1>
          <h2 className="text-lg">{movie.year}</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-700 text-md">{movie.description}</p>
          </div>
          <div className = "flex flex-row justify-between w-full mt-4">
            {userId && <Seen movieId={id} />}
            {userId && <Recommend movieId={id} />}
          </div>
        </div>
      </div>

  );
}
