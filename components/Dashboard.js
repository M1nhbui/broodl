'use client'
import { Fugaz_One } from "next/font/google";
import React, { useEffect, useState } from 'react'
import Calendar from './Calendar';
import { useAuth } from '@/context/AuthContext'
import { db } from '@/firebase'
import { doc, setDoc } from 'firebase/firestore'
import Login from './Login';
import Loading from './Loading';


const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Dashboard() {
    const { currentUser, userDataObj, setUserDataObj, loading } = useAuth()
    const { data, setData } = useState({})

    function countValues() {
    }

    async function handleSetMood(mood) {
        const now = new Date()
        const day = now.getDate()
        const month = now.getMonth() + 1 // months are 0-indexed
        const year = now.getFullYear()
        try {
            const newData = { ...userDataObj }
            if (!newData?.[year]) {
                newData[year] = {}
            }

            if (!newData?.[year]?.[month]) {
                newData[year][month] = {}
            }

            newData[year][month][day] = mood
            // update the current state
            setData(newData)
            // update the global state
            setUserDataObj(newData)
            // update firebase
            const docRef = doc(db, 'users', currentUser.uid)
            const res = await setDoc(docRef, {
                [year]: {
                    [month]: {
                        [day]: mood
                    }
                }
            }, { merge: true })

        } catch (err) {
            console.log('Failed to set data', err.message)
        }

    }

    const statuses = {
        num_days: 14,
        time_remaining: '13:14:16',
        date: (new Date()).toDateString()
    }

    const moods = {
        '&*@#$': '😭',
        'Sad': '🥲',
        'Existing': '😶',
        'Good': '😊',
        'Elated': '😍',
    }

    useEffect(() => {
        if (!currentUser || !userDataObj) {
            return
        }
        setData(userDataObj)


    }, [currentUser, userDataObj])



    if (loading) {
        return <Loading />
    }

    if (!currentUser) {
        return <Login />
    }

    return (
        <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16'>
            <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg '>
                {Object.keys(statuses).map((status, statusIndex) => {
                    return (
                        <div key={statusIndex} className=' flex flex-col gap-1 sm:gap-2'>
                            <p className='font-medium uppercase text-xs sm:text-sm truncate'>{status.replaceAll('_', ' ')}</p>
                            <p className={'text-base sm:text-lg truncate ' + fugaz.className}>{statuses[status]}</p>
                        </div>
                    )
                })}
            </div>
            <h4 className={'text-5xl sm:text-6xl md:text-7xl text-center ' + fugaz.className}>
                How do you <span className='textGradient'>feel</span> today?
            </h4>
            <div className='flex items-stretch flex-wrap gap-4'>
                {Object.keys(moods).map((mood, moodIndex) => {
                    return (
                        <button onClick={() => {
                            const currentMoodValue = moodIndex + 1
                            handleSetMood(currentMoodValue)
                        }} className={'p-4 px-5 rounded-2xl purpleShadow duration-200 bg-indigo-50 hover:bg-indigo-100 text-center flex flex-col item-center gap-2 flex-1 '} key={moodIndex}>
                            <p className='text-4xl sm:text-5xl md:text-6xl'>{moods[mood]}</p>
                            <p className={'text-indigo-500 text-xs sm:text-sm md:text-base ' + fugaz.className}>{mood}</p>
                        </button>
                    )
                })}
            </div>
            <Calendar data={data} handleSetMood={handleSetMood} />
        </div>
    )
}
