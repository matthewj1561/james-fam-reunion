"use client"
import styles from './page.module.css'
import AirbnbItem from './components/AirbnbItem'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from 'react';


export default function Home() {
  const [trueDb, setTrueDb] = useState()
  const [posts, setPosts] = useState([])
  const firebaseConfig = {
    apiKey: "AIzaSyBGrFTR7ldDZPN91JNMLq9WVzwc29BOJNc",
    authDomain: "james-fam-reunion-2024.firebaseapp.com",
    databaseURL: "https://james-fam-reunion-2024-default-rtdb.firebaseio.com",
    projectId: "james-fam-reunion-2024",
    storageBucket: "james-fam-reunion-2024.appspot.com",
    messagingSenderId: "73010049161",
    appId: "1:73010049161:web:7e63dc30f6573994361658",
    measurementId: "G-RD7WBE7WGH"
  };
  // Initialize Firebase
  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    setTrueDb(db)
    const q = query(collection(db, 'posts'))
    getDocs(q).then((querySnapshot) => {
      const posts = []
      querySnapshot.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id })
      })
      posts.sort((post1, post2) => { return post2.likes - post1.likes })
      setPosts(posts)
    })
  }, [])



  return (
    <main className={styles.main}>

      <div className={styles.center} style={{ textAlign: 'center' }}>
        <h1>James Family Reunion <br></br> - 2024 - </h1>
      </div>
      <div>
        <p>
          Here are some bnbs we could thought would be possible to use for our family reunion! Each post is clickable and
          will take you to the AirBnB listing. The prices listed are before tax and under the pretense that we would have 10 separate families in attendance that we could split the cost with.
        </p>
        <br></br>
        <div style={{ display: 'flex' }}>
          <ul style={{ width: '100%', listStylePosition: 'inside', textAlign: 'center' }}>
            <li>Mom and Robert </li>
            <li>Dad and Tessa</li>
            <li>Joseph's Fam</li>
            <li>Rachelle's Fam</li>
            <li>Aaron's Fam</li>
          </ul>
          <ul style={{ width: '100%', listStylePosition: 'inside', textAlign: 'center' }}>
            <li>Sarah's Fam</li>
            <li>Emily's Fam</li>
            <li>Chelsea's Fam</li>
            <li>Krista's Fam</li>
            <li>Matthew's Fam</li>
          </ul>
        </div>
        <br></br>
        <p>FYI - Whichever post has the most likes will be at the top. Like the listings you think we should choose to put in your 'vote'.</p>
        <br></br>
        <p>Another FYI - If you find a listing you want on this site, send the link to Matthew and he'll add it.</p>
      </div>
      <br></br>
      <hr style={{ color: 'white', width: '100vw' }}></hr>
      <br></br>
      <div className={styles.description}>
        <p>
          Please comment and tell us how you feel about these listings!
        </p>

      </div>

      <div className={styles.grid}>
        {posts.map((post) => {

          return < AirbnbItem
            key={post?.id}
            id={post?.id}
            url={post?.url}
            imgUrl={post?.imgUrl}
            title={post?.title}
            desc={post?.desc}
            comments={post?.comments}
            // Total before taxes, per family before taxes, beds, bedrooms, 
            facts={post?.facts}
            likes={post?.likes}
            db={trueDb}
          />
        })}
      </div>
    </main>
  )
}
