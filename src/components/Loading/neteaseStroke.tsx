import React from 'react'
import {useEffect} from 'react'
import './neteaseStroke.scss'

type NeteaseStrokeProps = {
  strokeDashoffset?: number
}
function NeteaseStroke({ strokeDashoffset }: NeteaseStrokeProps) {
  useEffect(() => {
    console.log(strokeDashoffset);
  }, [strokeDashoffset])
  return (
    <div className={strokeDashoffset === 0 ? 'loaded' : 'loading'}>
      <div>
        <svg
          viewBox="0 0 701 779"
          xmlns="http://www.w3.org/2000/svg"
          width="1.5em"
          height="1.5em"
        >
          <path
            id="netease-logo-stroke"
            fill="none"
            style={{ strokeDashoffset: strokeDashoffset + 'px' }}
            strokeWidth="90"
            d="M555.321234,79.4471945 C506.998348,45.4503317 468.868268,36.6177826 440.930993,52.9495474 C399.025081,77.4471945 382.649291,95.3154833 399.694257,162.463766 C416.739223,229.612048 461.740693,381.157392 461.740693,396.424472 C461.740693,411.691553 469.890747,522.664341 333.9469,512.965564 C228.842352,482.254155 228.842352,322.817241 325.792448,262.10529 C422.742544,201.393339 495.768476,236.615175 529.114176,251.860233 C562.459876,267.10529 645.352412,344.62348 652.987666,412.979366 C660.62292,481.335251 652.987666,577.074907 571.31168,655.760087 C489.635695,734.445266 329.023689,765.144654 208.891617,693.064921 C88.7595456,620.985189 15.4263678,495.191868 56.4726009,337.308907 C83.8367563,232.053599 151.627294,154.918868 259.844213,105.904715"
          ></path>
        </svg>
      </div>
    </div>
  )
}

export default React.memo(NeteaseStroke)
