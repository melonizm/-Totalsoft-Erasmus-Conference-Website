import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Card, Button } from '@totalsoft/rocket-ui'
import { useEmail } from 'hooks/useEmail'
import ConferenceTitle from './ConferenceTitle'
import ConferenceSubtitle from './ConferenceSubtitle'
import ConferenceContent from './ConferenceContent'
import { useNavigate } from 'react-router-dom'
import { useMutation, gql } from '@apollo/client'
import { useToast } from '@totalsoft/rocket-ui'

const DELETE_CONFERENCE = gql`
  mutation DeleteConference($id: Int!) {
    deleteConference(id: $id)
  }
`

const ConferenceItem = ({ conference }) => {
  const { id, name, organizerEmail, speakers, location } = conference
  const [email] = useEmail()
  const navigate = useNavigate()
  const showToast = useToast()
  const [deleteConference] = useMutation(DELETE_CONFERENCE, { refetchQueries: ['ConferenceList'] })

  const mainSpeaker = speakers.find(s => s.isMainSpeaker)

  const isOrganizer = email?.toUpperCase() === organizerEmail?.toUpperCase()

  const handleEdit = useCallback(() => {
    navigate(`/conferences/${id}`)
  }, [navigate, id])
  const title = isOrganizer
    ? <ConferenceTitle title={name} onEdit={handleEdit} />
    : name

  const handleView = useCallback(() => {
    navigate(`/conferences/view/${id}`)
  }, [navigate, id])

  const handleDelete = async () => {
    try {
      await deleteConference({ variables: { id } })
      showToast('Konferans başarıyla silindi!', 'success')
    } catch (e) {
      showToast('Konferans silinirken hata oluştu!', 'error')
    }
  }

  return (
    <Card
      title={title}
      subheader={<ConferenceSubtitle speaker={mainSpeaker} location={location} />}
    >
      <ConferenceContent conference={conference} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
        <Button color='secondary' variant='outlined' onClick={handleView}>GÖRÜNTÜLE</Button>
        <Button color='error' variant='outlined' onClick={handleDelete}>DELETE</Button>
      </div>
    </Card>
  )
}

ConferenceItem.propTypes = {
  conference: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    organizerEmail: PropTypes.string.isRequired,
    speakers: PropTypes.array.isRequired,
    location: PropTypes.string
  }).isRequired
}

export default ConferenceItem
