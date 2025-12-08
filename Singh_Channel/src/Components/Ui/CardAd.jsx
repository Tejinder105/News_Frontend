import React from "react";
import Panel from "./Panel";


function CardAd({ data }) {
  return (
    <Panel variant="ad" padding={false}>
      <div className="w-full">
        <img
          src={data.image}
          alt={data.name}
          className="h-40 w-full object-cover"
        />
      </div>
      <div className="px-3">
        <h3 className="text-lg font-bold font-serif text-gray-900 truncate">{data.headline}</h3>
        <p className="mb-2 text-sm text-gray-700 line-clamp-2">{data.description}</p>
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-gray-500">
              {data.name}
            </span>
            <span className="text-xs text-gray-400">| Sponsored</span>
          </div>
          <a
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block whitespace-nowrap rounded-sm border border-black px-4 py-1 text-xs font-semibold text-black transition hover:bg-black hover:text-white"
          >
            {data.tag}
          </a>
        </div>
      </div>
    </Panel>
  );
}

export default CardAd;
