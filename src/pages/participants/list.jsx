import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListTable } from './table';
import { https } from '../../services/https';
import { paginationCount } from '../../utils/constants';
import { PageTitle } from '../../components/content-header/PageTitle';

function ParticipantList() {
  const navigate = useNavigate()
  const [participantsAll, setParticipantsAll] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [page, setPage] = useState(1);

  const getData = async () => {
    try {
      const res = await https.get('/participants');
      const { data } = res;
      setParticipantsAll(data)
      setParticipants(data.slice(0, paginationCount));
    } catch (err) {
      console.error(err);
    }
  };

  const paginateData = (count) => {
    const list = participantsAll.slice((count - 1)*paginationCount, count*paginationCount)
    setParticipants(list)
  }

  const onNavigate = () =>{
    navigate('/participants/form', { replace: true })
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    paginateData(page)
  }, [page])

  return (
    <div>
      <PageTitle title={'Participants'} onNavigate={onNavigate}/>
      <ListTable 
        users={participants} 
        setUsers={setParticipants}
        users_all={participantsAll}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

export default ParticipantList;
