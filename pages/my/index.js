import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import MyLayout from "../../components/my/MyLayout";
import connectMongo from "../../utils/connectMongo";
import { User, Circle } from "../../models";
import { getCookie, getCookies } from "cookies-next";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useState, Suspense } from "react";
import Feed from "../../components/my/Feed";

export async function getServerSideProps(context) {
  const cookies = getCookies(context);
  if (cookies.token) {
    await connectMongo();
    let user = await User.findOne(
      { token: cookies.token },
      {
        _id: 1,
        username: 1,
        displayName: 1,
        email: 1,
        profile: 1,
        prefs: 1,
        createdAt: 1,
        updatedAt: 1,
        loginToken: 1,
      }
    );
    if (user) {
      let circles = await Circle.find({ user: user._id });
      user = JSON.parse(JSON.stringify(user));
      circles = JSON.parse(JSON.stringify(circles));
      return {
        props: { user, circles }, // will be passed to the page component as props
      };
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }
}

const CreatePost = dynamic(() => import("../../components/my/CreatePost"), {
  suspense: true,
});

export default function MyHome(props) {
  // const router = useRouter()
  // const token = getCookie("token");
  // if (!token) router.push('/login')
  return (
    <>
      <Head>
        <title>Kowloon</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main id="main" className="grid w-full grid-cols-12">
        <div className="col-span-5 p-8">
          <div className="rounded-lg border-gray-600 border-1 bg-white dark:bg-slate-800 p-8 shadow-md shadow-black/20 fixed">
            <Suspense fallback={`Loading...`}>
              <CreatePost
                circles={props.circles}
                user={props.user}
                editorKey={"editor"}
              />
            </Suspense>
          </div>
        </div>
        <div className="col-span-6">
          <h1 className="text-xl font-bold pt-4 pb-8">Feed</h1>
          <Feed />
        </div>
      </main>
    </>
  );
}

MyHome.getLayout = function getLayout(page) {
  return <MyLayout>{page}</MyLayout>;
};
