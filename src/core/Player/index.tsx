import React, { memo } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { storeType } from '@/store/data'
import NormalPlayer from './normalPlayer'

const currentSong = {
  al: {
    picUrl:
      'https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg',
  },
  name: '木偶人',
  ar: [{ name: '薛之谦' }],
}

function Player(props: RouteComponentProps) {
  const fullScreen = useSelector((state: storeType) => state.player.fullScreen)
  /* const currentSong = useSelector(
    (state: storeType) => state.player.currentSong,
  ) */
  const currentIndex = useSelector(
    (state: storeType) => state.player.currentIndex,
  )
  const mode = useSelector((state: storeType) => state.player.mode)
  const playList = useSelector((state: storeType) => state.player.playList)
  const playing = useSelector((state: storeType) => state.player.playing)
  const sequencePlayList = useSelector(
    (state: storeType) => state.player.sequencePlayList,
  )
  const showPlayList = useSelector(
    (state: storeType) => state.player.showPlayList,
  )
  return (
    <div>
      <NormalPlayer song={currentSong} fullScreen={fullScreen} />
    </div>
  )
}

export default memo(withRouter(Player))
