"use client"
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { arrayUnion, doc, increment, updateDoc } from 'firebase/firestore'
import styles from '../page.module.css'
import thumbsUp from '../../../public/thumbsUp.png'
import Image from 'next/image'


export default function AirbnbItem({ id, url, imgUrl, title, desc, facts, comments, likes, db }) {

    const [showMore, setShowMore] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [canLike, setCanLike] = useState(true)
    const [statefulLikes, setStatefulLikes] = useState(likes)
    const [statefulComments, setStatefulComments] = useState(comments)
    // const [comments, setComments] = useState([])

    // useEffect(() => {

    // }, [showComments])
    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    async function submitComment(e) {
        e.preventDefault()

        const name = e.target[0].value
        const body = e.target[1].value

        const commentRef = doc(db, "posts", id);

        await updateDoc(commentRef, {
            comments: arrayUnion({
                name: name || 'Anonymous',
                body: body
            })

        })

        setStatefulComments([...statefulComments, {
            name: name || 'Anonymous',
            body: body
        }])

        e.target[0].value = ''
        e.target[1].value = ''
        setShowComments(true)

    }


    async function likePost() {
        setCanLike(!canLike)
        if (canLike) {

            const commentRef = doc(db, "posts", id);

            await updateDoc(commentRef, {
                likes: increment(1)
            })
            setStatefulLikes(statefulLikes + 1)
        } else {
            const commentRef = doc(db, "posts", id);

            await updateDoc(commentRef, {
                likes: increment(-1)
            })
            setStatefulLikes(statefulLikes - 1)
        }
    }

    return (
        <div className={styles.card} style={{ marginTop: '10px' }}>
            <a
                href={url}
                className={styles.innerCard}
                target="_blank"
            >
                <img className={styles.img} src={imgUrl} alt="Cabin"></img>
                <h2>
                    {title} <span>-&gt;</span>
                </h2>
                <p>{desc}</p>
            </a>
            {showMore && <div>
                <br></br>

                <ul style={{ textAlign: 'left' }}>
                    <li className={styles.text}>Total Cost: {USDollar.format(facts.totalBeforeTax)}</li>
                    <li className={styles.text}>Cost Per Family: {USDollar.format(facts.perFam)}</li>
                    <li className={styles.text}>Beds: {facts.beds}</li>
                    <li className={styles.text}>Bedrooms: {facts.bedrooms}</li>
                </ul>
            </div>
            }
            <br></br>
            <div style={{ margin: '0 -1rem', textAlign: 'center', display: 'flex', justifyContent: 'space-around' }}>

                <button className={styles.button} onClick={() => { setShowMore(!showMore) }}>{showMore ? 'Less Detail' : 'More Detail'}</button>
                <button className={styles.button} onClick={() => { setShowComments(!showComments) }}>{showComments ? 'Hide Comments' : 'Show Comments'}</button>

                <div style={{ display: 'flex' }}>

                    <Image style={{ alignSelf: 'center' }} className={canLike ? styles.thumb : styles.thumbBlue} onClick={() => { likePost() }} src={thumbsUp}></Image>

                    <div style={{ alignSelf: 'center', marginLeft: '5px' }} className={styles.text}>{statefulLikes}</div>
                </div>
            </div>

            {showComments && <Comments comments={statefulComments}></Comments>}
            <hr className={styles.hr}></hr>
            <form style={{ margin: 'auto -1rem' }} onSubmit={(e) => { submitComment(e) }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>

                        <input className={styles.input} placeholder='Your Name' />
                        <textarea required spellCheck rows={2} className={styles.input} placeholder='What do you think?' />
                    </div>
                    <button type="submit" className={styles.button} >Comment</button>
                </div>
            </form>



        </div>
    )
}


function Comments({ comments }) {
    if (comments.length) {

        return comments.map((comment) => {
            return <div style={{ marginTop: '5px', textAlign: "left", padding: "0.5rem" }} className={styles.comment}>
                <h5 >{comment?.name}</h5>
                <div className={styles.text}>{comment?.body}</div>
            </div>
        })
    } else {
        return <div className={styles.text}>No comments yet.</div>
    }
}