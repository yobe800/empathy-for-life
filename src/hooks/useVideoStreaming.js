import { useEffect, useContext } from "react";

import socket from "../socket/socket";
import {
  ReducerContext,
  selectors,
} from "../features/rootSlice";

const useVideoStreaming = (videoRef, navRef) => {
  const { state } = useContext(ReducerContext);
  const isAdministrator = selectors.getIsAdministrator(state);

  useEffect(() => {
    let $cameraSelect, $streamingOnBtn;

    for (const element of navRef.current.children) {
      switch (element.name) {
        case "cameraSelect":
          $cameraSelect = element;
          break;
        case "streamingOn":
          $streamingOnBtn = element;
          break;
      }
    }

    let isOnStreaming = false;
    const $video = videoRef.current;
    const iceServers = {
      iceServers: [
        { urls: "stun:stun.services.mozilla.com" },
        { urls: "stun:stun.l.google.com:19302" },
      ],
    };
    const streamConstraints = { audio: true, video: true };
    const rtcPeerConnections = {};

    if (isAdministrator) {
      $streamingOnBtn.onclick = () => {
        if (!isOnStreaming) {
          isOnStreaming = true;
          navigator?.mediaDevices
          .getUserMedia(streamConstraints)
          .then((stream) => {
            $video.srcObject = stream;
            socket.emit("start streaming", socket.id);
          })
          .catch((error) => {
            console.log(error);
          });
        }
      };

      socket.on(
        "new viewers",
        (viewers) => {
          viewers.forEach(({ id }) => {
            rtcPeerConnections[id] = new RTCPeerConnection(iceServers);

            const stream = $video.srcObject;
            stream
              .getTracks()
              .forEach((track) => rtcPeerConnections[id].addTrack(track, stream));

            rtcPeerConnections[id].onicecandidate = (event) => {
              if (event.candidate) {
                socket.emit(
                  "candidate",
                  id,
                  {
                    type: "candidate",
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate,
                  },
                );
              }
            };
            rtcPeerConnections[id]
              .createOffer()
              .then((sessionDescription) => {
                rtcPeerConnections[id].setLocalDescription(sessionDescription);
                socket.emit(
                  "offer",
                  id,
                  {
                    type: "offer",
                    sdp: sessionDescription,
                  },
                );
              })
              .catch((error) => {
                console.log(error);
              });
          });
        },
      );
      socket.on(
        "answer",
        (viewerId, sdp) => {
          rtcPeerConnections[viewerId]
            .setRemoteDescription(new RTCSessionDescription(sdp));
        },
      );
    }

    socket.on(
      "offer",
      (broadcasterId, sdp) => {
        rtcPeerConnections[broadcasterId] = new RTCPeerConnection(iceServers);
        rtcPeerConnections[broadcasterId].setRemoteDescription(sdp);
        rtcPeerConnections[broadcasterId]
          .createAnswer()
          .then((sessionDescription) => {
            rtcPeerConnections[broadcasterId].setLocalDescription(sessionDescription);
            socket.emit(
              "answer",
              {
                type: "answer",
                sdp: sessionDescription,
              }
            );
          });

        rtcPeerConnections[broadcasterId].ontrack = (event) => {
          $video.srcObject = event.streams[0];
        };
        rtcPeerConnections[broadcasterId].onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit(
              "candidate",
              broadcasterId,
              {
                type: "candidate",
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate,
              }
            );
          }
        };

      },
    );
    socket.on(
      "candidate",
      (id, { label, candidate: recievedCandidate }) => {
        const candidate = new RTCIceCandidate({
          sdpMLineIndex: label,
          candidate: recievedCandidate,
        });
        rtcPeerConnections[id].addIceCandidate(candidate);
      },
    );

    if (!isAdministrator) {
      socket.emit("register as viewer");
    }
  }, [videoRef]);

};

export default useVideoStreaming;
