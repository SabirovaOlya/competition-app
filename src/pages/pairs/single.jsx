import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaLocationDot, FaUsersBetweenLines } from "react-icons/fa6";
import { https } from '../../services/https';
import { BackButton } from '../../components/buttons/BackButton';
import { alert } from '../../components/alert/alert';
import user_image from '../../assets/images/user.png'


function PairSingle() {
  const { id } = useParams();
  const [pair, setPair] = useState(null);

  const getData = async() => {
    try {
      const res = await https.get(`/pairs/${id}`)
      const { data } = res;
      setPair(data)
    }
    catch(err){
      console.log(err);
    }
  }

  const changeWinner = async(winner_id) => {
    try {
      const res = await https.post('/update-winner/', {
        pair_id: id,
        winner_id
      })
      alert('Winner updated', 'success')
    }
    catch(err){
      console.log(err);
    }
  }

  const getBorderColor = (participantId) => {
    if (!pair?.winner) {
      return 'border-yellow-500';
    }
    return pair?.winner === participantId ? 'border-green-500' : 'border-red-500';
  };
  
  const getBackColor = (participantId) => {
    if (!pair?.winner) {
      return 'bg-yellow-100';
    }
    return pair?.winner === participantId ? 'bg-green-100' : 'bg-red-100';
  };

  useEffect(() => {
    getData()
  }, [id]);

  return (
    <div className="container mt-4">
      <BackButton path={'/pairs'} />
      <h4 className='text-center'>{pair?.competition?.name}</h4>
      <h5 className='text-center'>{pair?.level} Level</h5>
      <div className='mt-8 flex justify-around'>
        {
          [pair?.participant1, pair?.participant2]?.map(participant =>(
            <div className={`border-3 ${getBorderColor(participant?.id)} ${getBackColor(participant?.id)} rounded overflow-hidden`}>
              <img 
                className='min-w-80'
                src={participant?.image ? participant?.image : user_image} />
              <div className='p-2 text-sm'>
                <p className='m-0 mt-2'><span className='font-bold'>Name: </span>{participant?.name}</p>
                <p className='m-0 mt-2'><span className='font-bold'>ID: </span>{participant?.unique_id}</p>
                <p className='m-0 mt-2'><span className='font-bold'>Age: </span>{participant?.age} years</p>
                <p className='m-0 mt-2'><span className='font-bold'>Weight: </span>{participant?.weight} kg</p>
                <p className='m-0 mt-2'><span className='font-bold'>Gender: </span>{participant?.gender === 1 ? 'Boy' : 'Girl'}</p>
              </div>
              {
                pair?.winner ? 
                <></> : 
                <div className='flex justify-center'>
                  <button 
                    onClick={() => {changeWinner(participant?.id)}}
                    className='mb-2 border-1 border-green-500 bg-green-100 p-2 rounded text-sm font-bold duration-200 hover:bg-green-400'
                  >
                    Make winner
                  </button>
                </div>
              }
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default PairSingle;
