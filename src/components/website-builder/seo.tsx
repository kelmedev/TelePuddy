"use client";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import api from "@/_services/API";
import { useSession } from "next-auth/react";
interface Props {
  id: string;
}

const SeoPannel = ({ id }: Props) => {
  const { data: session } = useSession();

  const token = session?.authorization;

  const [data, setData] = useState({
    title: "",
    description: "",
    keywords: "",
    author: "",
    robots: "",
    og_title: "",
    og_description: "",
    og_image: "",
    og_url: "",
    og_type: "",
  });

  const load = async () => {
    try {
      const seo = await api.get("/website/list-website-seo/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(seo.data);
      console.log(seo.data);
    } catch (error) {
      console.log(error);
    }
  };
  const save = async () => {
    try {
      await api.put(
        `/website/update-website-seo/${id}`,
        {
          ...data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex flex-col" style={{ height: "100%" }}>
      <div className="p-4">
        <label
          htmlFor="title"
          className="flex mb-2 text-sm font-medium text-white-900 dark:text-white w-full"
        >
          title
        </label>
        <input
          type="text"
          id="title"
          value={data.title}
          onChange={(e) =>
            setData((prev) => ({ ...prev, title: e.target.value }))
          }
          onBlur={() => {
            save();
          }}
          className="bg-transparent border border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Your Page Title - Important for SEO"
          required
        />
      </div>

      <div className="p-4">
        <label
          htmlFor="description"
          className="flex mb-2 text-sm font-medium text-white-900 dark:text-white w-full"
        >
          description
        </label>
        <input
          type="text"
          id="description"
          value={data.description}
          onChange={(e) =>
            setData((prev) => ({ ...prev, description: e.target.value }))
          }
          onBlur={() => {
            save();
          }}
          className="bg-transparent border border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="A brief description of the webpage that summarizes the content. This is important for SEO."
          required
        />
      </div>

      <div className="p-4">
        <label
          htmlFor="keywords"
          className="flex mb-2 text-sm font-medium text-white-900 dark:text-white w-full"
        >
          keywords
        </label>
        <input
          type="text"
          id="keywords"
          value={data.keywords}
          onChange={(e) =>
            setData((prev) => ({ ...prev, keywords: e.target.value }))
          }
          onBlur={() => {
            save();
          }}
          className="bg-transparent border border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="relevant, keywords, separated, by, commas"
          required
        />
      </div>

      <div className="p-4">
        <label
          htmlFor="author"
          className="flex mb-2 text-sm font-medium text-white-900 dark:text-white w-full"
        >
          author
        </label>
        <input
          type="text"
          id="author"
          value={data.author}
          onChange={(e) =>
            setData((prev) => ({ ...prev, author: e.target.value }))
          }
          onBlur={() => {
            save();
          }}
          className="bg-transparent border border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Your Name or Company"
          required
        />
      </div>

      <div className="p-4">
        <label
          htmlFor="robots"
          className="flex mb-2 text-sm font-medium text-white-900 dark:text-white w-full"
        >
          robots
        </label>
        <input
          type="text"
          id="robots"
          value={data.robots}
          onChange={(e) =>
            setData((prev) => ({ ...prev, robots: e.target.value }))
          }
          onBlur={() => {
            save();
          }}
          className="bg-transparent border border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="index, follow"
          required
        />
      </div>

      <div className="p-4">
        <label
          htmlFor="og:title"
          className="flex mb-2 text-sm font-medium text-white-900 dark:text-white w-full"
        >
          og:title
        </label>
        <input
          type="text"
          id="og:title"
          value={data.og_title}
          onChange={(e) =>
            setData((prev) => ({ ...prev, og_title: e.target.value }))
          }
          onBlur={() => {
            save();
          }}
          className="bg-transparent border border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Your Page Title"
          required
        />
      </div>

      <div className="p-4">
        <label
          htmlFor="og:description"
          className="flex mb-2 text-sm font-medium text-white-900 dark:text-white w-full"
        >
          og:description
        </label>
        <input
          type="text"
          id="og:description"
          value={data.og_description}
          onChange={(e) =>
            setData((prev) => ({ ...prev, og_description: e.target.value }))
          }
          onBlur={() => {
            save();
          }}
          className="bg-transparent border border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="A brief description of the webpage for social media."
          required
        />
      </div>

      <div className="p-4">
        <label
          htmlFor="og:image"
          className="flex mb-2 text-sm font-medium text-white-900 dark:text-white w-full"
        >
          og:image
        </label>
        <input
          type="text"
          id="og:image"
          value={data.og_image}
          onChange={(e) =>
            setData((prev) => ({ ...prev, og_image: e.target.value }))
          }
          onBlur={() => {
            save();
          }}
          className="bg-transparent border border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="URL to image that represents the content"
          required
        />
      </div>

      <div className="p-4">
        <label
          htmlFor="og:url"
          className="flex mb-2 text-sm font-medium text-white-900 dark:text-white w-full"
        >
          og:url
        </label>
        <input
          type="text"
          id="og:url"
          value={data.og_url}
          onChange={(e) =>
            setData((prev) => ({ ...prev, og_url: e.target.value }))
          }
          onBlur={() => {
            save();
          }}
          className="bg-transparent border border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="https://www.example.com/page-url"
          required
        />
      </div>

      <div className="p-4">
        <label
          htmlFor="og:type"
          className="flex mb-2 text-sm font-medium text-white-900 dark:text-white w-full"
        >
          og:type
        </label>
        <input
          type="text"
          id="og:type"
          value={data.og_type}
          onChange={(e) =>
            setData((prev) => ({ ...prev, og_type: e.target.value }))
          }
          onBlur={() => {
            save();
          }}
          className="bg-transparent border border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="website"
          required
        />
      </div>
    </div>
  );
};

export default SeoPannel;
