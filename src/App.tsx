import React, { FC } from 'react'
import Radar from './components/Radar'


const defaultBlips = [
  { quadrant: 'Thanos', name: 'Nagging', score: 5, desc: 'Fun isn\'t something one considers when balancing the universe.'},
  { quadrant: 'Thanos', name: 'Snap finger', score: 5, desc: ''},
  { quadrant: 'Thanos', name: 'Immortal', score: 5, desc: ''},
  { quadrant: 'Thanos', name: 'Strategy', score: 3, desc: ''},
  { quadrant: 'Thanos', name: 'Telekinesis', score: 2, desc: ''},
  { quadrant: 'Thanos', name: 'Obsession with earth', score: 2, desc: ''},
  { quadrant: 'Thanos', name: 'Telepathy', score: 2, desc: ''},
  { quadrant: 'Thanos', name: 'Strategy', score: 1, desc: ''},

  { quadrant: 'Deadpool', name: 'Break 4th wall', score: 5, desc: ''},
  { quadrant: 'Deadpool', name: 'Pain insensitve', score: 4, desc: ''},
  { quadrant: 'Deadpool', name: 'Swording', score: 4, desc: ''},
  { quadrant: 'Deadpool', name: 'Multilingual', score: 4, desc: ''},
  { quadrant: 'Deadpool', name: 'Accelerated healing', score: 3, desc: ''},
  { quadrant: 'Deadpool', name: 'Gun shooting', score: 3, desc: ''},
  { quadrant: 'Deadpool', name: 'Savate', score: 3, desc: ''},
  { quadrant: 'Deadpool', name: 'Kniving', score: 3, desc: ''},
  { quadrant: 'Deadpool', name: 'Immortal', score: 2, desc: ''},
  { quadrant: 'Deadpool', name: 'Assassination', score: 2, desc: ''},

  { quadrant: 'Iron Man', name: 'Rich', score: 5, desc: ''},
  { quadrant: 'Iron Man', name: 'Armoring', score: 5, desc: ''},
  { quadrant: 'Iron Man', name: 'Computer Science', score: 4, desc: ''},
  { quadrant: 'Iron Man', name: 'Quantum Mechanics', score: 4, desc: ''},
  { quadrant: 'Iron Man', name: 'Electrical Engineering', score: 3, desc: ''},
  { quadrant: 'Iron Man', name: 'Fly', score: 2, desc: ''},
  { quadrant: 'Iron Man', name: 'Mathematics', score: 2, desc: '1 + 1 ≠ 2'},
  { quadrant: 'Iron Man', name: 'Physics', score: 2, desc: ''},
  { quadrant: 'Iron Man', name: 'Mechanical Engineering', score: 2, desc: ''},
  { quadrant: 'Iron Man', name: 'AI', score: 2, desc: ''},

  { quadrant: 'Black Widow', name: 'Freelancing', score: 5, desc: 'I\'m multitasking.'},
  { quadrant: 'Black Widow', name: 'Psychological Manipulation', score: 5, desc: ''},
  { quadrant: 'Black Widow', name: 'Kong Fu', score: 5, desc: ''},
  { quadrant: 'Black Widow', name: 'Ballerina', score: 4, desc: ''},
  { quadrant: 'Black Widow', name: 'Judo', score: 4, desc: ''},
  { quadrant: 'Black Widow', name: 'Karate', score: 4, desc: ''},
  { quadrant: 'Black Widow', name: 'Ageless', score: 3, desc: ''},
  { quadrant: 'Black Widow', name: 'Kenpo', score: 3, desc: ''},
  { quadrant: 'Black Widow', name: 'Savate', score: 5, desc: ''},
  { quadrant: 'Black Widow', name: 'Ninjutsu', score: 3, desc: ''},
  { quadrant: 'Black Widow', name: 'Aikido', score: 2, desc: ''},
  { quadrant: 'Black Widow', name: 'Sambo', score: 2, desc: ''},
  { quadrant: 'Black Widow', name: 'Boxing', score: 1, desc: ''},
]

const App: FC = () => (
  <Radar blips={ defaultBlips } />
)

export default App
