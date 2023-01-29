import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Pokemon } from "../../utils/types";

interface Params {
  id: string;
}

export async function getStaticPaths() {
  try {
    const resp = await fetch(
      `https://jherr-pokemon.s3.us-west-1.amazonaws.com/index.json`
    );
    const pokemon = await resp.json();
    return {
      paths: pokemon.map((pokemon: Pokemon) => ({
        params: { id: pokemon.id.toString() },
      })),
      fallback: false,
    };
  } catch (error) {
    return error;
  }
}

export async function getStaticProps({ params }: { params: Params }) {
  try {
    const res = await fetch(
      `https://jherr-pokemon.s3.us-west-1.amazonaws.com/pokemon/${params.id}.json`
    );
    return {
      props: {
        pokemon: await res.json(),
      },
    };
  } catch (error) {
    return error;
  }
}

function PokemonDetails({ pokemon }: { pokemon: Pokemon }) {
  return (
    <div className="p-5">
      <Link href={"/"}>
        <h2 className="text-2xl font-semibold underline">
          {" "}
          ...Back to pokemon list
        </h2>
      </Link>
      <div key={pokemon.id} className="flex flex-col items-center p-4">
        <Image
          src={`https://jherr-pokemon.s3.us-west-1.amazonaws.com/${pokemon.image}`}
          alt={pokemon.name}
          width={200}
          height={200}
          className="h-96 w-96 object-contain"
        />
        <h3 className="font-bold text-4xl m-4">{pokemon.name.toUpperCase()}</h3>
        <h4>Stats:</h4>
        <div className="w-1/3 bg-slate-300 m-4 rounded-md p-6 ">
          <table className="w-full">
            <thead className="w-full">
              <tr className="p-4">
                <div className="flex justify-between">
                  <td className="font-semibold">name</td>
                  <td className="font-semibold">value</td>
                </div>
              </tr>
            </thead>
            <tbody className="w-full">
              {pokemon.stats.map(({ name, value }) => (
                <tr key={name} className="gap-4">
                  <div className="flex justify-between">
                    <td className="">{name}</td>
                    <td className="">{value}</td>
                  </div>
                  <hr className="border-1 border-black w-full border-dotted" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetails;
