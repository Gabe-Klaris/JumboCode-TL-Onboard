import Link from 'next/link';
import { Movie } from '../../../types/movie';


export async function generateStaticParams() {
  return Array.from({ length: 10 }, (_  , i) => ({
    i: i + 1,
    page: i.toString(),
  }));
}

async function getPage(page: string) {
    const res = await fetch(`https://jumboboxd.soylemez.net/api/list?page=${page}`);
    if (!res.ok) throw new Error('Page not found');
    return res.json();
}


export default async function movie_list ({ params }: { params: { page: string } }) {

    const data = await getPage(params.page);

    return (
        <div>
        <div className="grid grid-cols-5 gap-10 m p-4">
            {data.map((movie: Movie) => (
                <a key={movie.id} className="flex flex-col rounded hover:scale-110" href={`/movie/${movie.id}`}>
                    <img src={movie.poster} alt={movie.title} width={100} height={150} className='w-full'/>
                    <div className ="bg-gray-400 rounded h-20 p-2 flex flex-row justify-between">
                        <h3 className='text-black font-bold'>{movie.title}</h3>
                        <p className='text-black'>{movie.year}</p>
                    </div>
                </a>
            ))}
        </div>
        <div className="flex justify-center mt-4">
            {params.page !== '1' && <Link href={`/list/${parseInt(params.page) - 1}`} className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2">
                Previous
            </Link>}
            {params.page !== '10' && <Link href={`/list/${parseInt(params.page) + 1}`} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                Next
            </Link>}
        </div>
    </div>
    );
};