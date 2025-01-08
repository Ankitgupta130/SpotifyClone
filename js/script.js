let currentSong = new Audio()
let songs;
let currFolder;

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input"
    }
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds to always be two digits
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Return the formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`${folder}/`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index]
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    //Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                             <img class="invert" src="img/music.svg" alt="">
                             <div class="info">
                                 <div>${song.replaceAll("%20", " ")}</div>
                                 <div>Raftaar</div>
                             </div>
                             <div class="playnow">
                                 <span>Play Now</span>
                                 <img class="invert" src="img/play.svg" alt="">
                             </div> </li>`
    }

    //Attach an event listener to all songs

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/SONGS/"+track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"

    }
    currentSong.play()
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/ 00:00"
}

// async function displayAlbums() {
//     let a = await fetch(`songs/`)
//     let response = await a.text();
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a")
//     let cardContainer = document.querySelector(".cardContainer")
//     let array =  Array.from(anchors)
//         for (let index = 0; index < array.length; index++) {
//             const e = array[index];

//         if (e.href.includes("/songs")) {
//             let folder = e.href.split("/").slice(-1)[0]
//             // Get metadata of the folder
//             let a = await fetch(`songs/${folder}/info.json`)
//             let response = await a.json()
//             console.log(response)
//             cardContainer.innerHTML = cardContainer.innerHTML + `<div class="cardContainer">
//                     <div data-folder="harddrive" class="card">
//                         <div class="play">
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
//                                 fill="none">
//                                 <path
//                                     d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
//                                     stroke="black" fill="#000" stroke-width="1.5" stroke-linejoin="round" />
//                             </svg>

//                         </div>
//                         <img src="/songs/${folder}/Baawe.webp" alt="">
//                         <h2>${response.title}</h2>
//                         <p>${response.description}</p>
//                     </div>`
//         }
//     }

//         //Load the playlist whenever the card is clicked
//         Array.from(document.getElementsByClassName("card")).forEach(e => {
//         // console.log(e)
//             e.addEventListener("click", async item => {
//             songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)

//         })
//     })

// }



async function displayAlbums() {
    try {
        let a = await fetch(`songs/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let anchors = div.getElementsByTagName("a");
        let cardContainer = document.querySelector(".cardContainer");
        let array = Array.from(anchors);

        for (let index = 0; index < array.length; index++) {
            const e = array[index];

            if (e.href.includes("/songs") && !e.href.includes(".htaccess")){
                let folder = e.href.split("/").slice(-1)[0];

                // Get metadata of the folder
                try {
                    let metadata = await fetch(`songs/${folder}/info.json`);
                    let response = await metadata.json();
                    console.log(response);

                    cardContainer.innerHTML += `
                        <div data-folder="${folder}" class="card">
                            <div class="play">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
                                    <path
                                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                        stroke="black" fill="#000" stroke-width="1.5" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <img src="/songs/${folder}/cover.webp" alt="Song Image">
                            <h2>${response.title}</h2>
                            <p>${response.description}</p>
                        </div>`;
                } catch (err) {
                    console.warn(`Could not fetch metadata for ${folder}:`, err);
                }
            }
        }

        // Load the playlist whenever the card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                let folder = item.currentTarget.dataset.folder;
                try {
                    let songs = await getSongs(`songs/${folder}`);
                    console.log("Songs loaded for folder:", folder, songs);
                } catch (err) {
                    console.error(`Error loading songs for ${folder}:`, err);
                }
                playMusic(songs[0])
            });
        });
    } catch (err) {
        console.error("Error fetching songs directory:", err);
    }
}





async function main() {

    // Display all the albums on the page
    displayAlbums()

    //get the list of all the songs
    await getSongs("songs/harddrive")
    playMusic(songs[0], true)



    //Attach event listener to play next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        } else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event Listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })


    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an event listener to previous and next
    // previous.addEventListener("click", () => {
    //     let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    //     if ((index - 1) >= 0) {
    //         playMusic(songs[index - 1])
    //     }
    // })

    // next.addEventListener("click", () => {
    //     // currentSong.pause()
    //     let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    //     if ((index + 1) < songs.length) {
    //         playMusic(songs[index + 1])
    //     }
    // })


    previous.addEventListener("click", () => {
        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").pop()));
        if (index > 0) {
            playMusic(songs[index - 1]);
        } else {
            playMusic(songs[songs.length - 1]); // Loop to the last song
        }
    });
    
    next.addEventListener("click", () => {
        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").pop()));
        if (index < songs.length - 1) {
            playMusic(songs[index + 1]);
        } else {
            playMusic(songs[0]); // Loop to the first song
        }
    });
    

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
    })

    // Add event listener to mute the track 
    // document.querySelector(".volume>img").addEventListener("click", e => {
    //     if (e.target.src.includes("volume.svg")) {
    //         e.target.src = e.target.src.replace("volume.svg", "mute.svg")
    //         currentSong.volume = 0;
    //         document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    //     }
    //     else if(e.target.src.includes("mute.svg")){
    //         document.querySelector(".range").getElementsByTagName("input")[0].value = .1;
    //         e.target.src = e.target.src.replace("mute.svg","volume.svg")

    //     }
    //     else {
    //         e.target.src = e.target.src.replace("mute.svg", "volume.svg")
    //         currentSong.volume = .10
    //         document.querySelector(".range").getElementsByTagName("input")[0].value = .10;

    //     }
    // })

    const volumeIcon = document.querySelector(".volume>img");
    const volumeSlider = document.querySelector(".range input");

    // Ensure slider range is set correctly
    volumeSlider.min = 0;
    volumeSlider.max = 1;
    volumeSlider.step = 0.01; // Optional: finer control

    // Update volume when the slider value changes
    function updateVolume(volume) {
        // Clamp volume to valid range [0, 1]
        const clampedVolume = Math.max(0, Math.min(volume, 1));
        currentSong.volume = clampedVolume;
        volumeSlider.value = clampedVolume;

        // Update the icon based on volume level
        if (clampedVolume === 0) {
            volumeIcon.src = volumeIcon.src.replace("img/volume.svg", "img/mute.svg");
        } else {
            volumeIcon.src = volumeIcon.src.replace("img/mute.svg", "img/volume.svg");
        }
    }

    // Handle mute/unmute click
    volumeIcon.addEventListener("click", () => {
        if (volumeIcon.src.includes("img/volume.svg")) {
            // Mute
            updateVolume(0);
        } else if (volumeIcon.src.includes("img/mute.svg")) {
            // Unmute and set to a default volume
            updateVolume(0.1);
        }
    });

    // Listen for changes in the range slider (both `input` and `change` events)
    volumeSlider.addEventListener("input", (e) => {
        updateVolume(parseFloat(e.target.value));
    });

    volumeSlider.addEventListener("change", (e) => {
        updateVolume(parseFloat(e.target.value));
    });



}

main() 