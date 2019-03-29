package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"sort"
	"strconv"
	"sync"
	"time"
)

type TwitchResponse struct {
	Stream struct {
		ID          *int       `json:"id"`
		Game        *string    `json:"game"`
		Viewers     *int       `json:"viewers"`
		VideoHeight *int       `json:"videoheight"`
		AverageFps  *int       `json:"averggefps"`
		Delay       *int       `json:"delay"`
		CreatedAt   *time.Time `json:"createdAt"`
		IsPlaylist  *bool      `json:"isPlaylist"`
		Preview     struct {
			Small    *string `json:"small"`
			Medium   *string `json:"medium"`
			Large    *string `json:"large"`
			Template *string `json:"template"`
		}
		Channel struct {
			Mature                       bool        `json:"mature"`
			Status                       *string     `json:"status"`
			BroadcasterLanguage          string      `json:"broadcaster_language"`
			DisplayName                  string      `json:"display_name"`
			Game                         string      `json:"game"`
			Language                     string      `json:"language"`
			ID                           int         `json:"_id"`
			Name                         string      `json:"name"`
			CreatedAt                    time.Time   `json:"created_at"`
			UpdatedAt                    time.Time   `json:"updated_at"`
			Partner                      bool        `json:"partner"`
			Logo                         string      `json:"logo"`
			VideoBanner                  string      `json:"video_banner"`
			ProfileBanner                string      `json:"profile_banner"`
			ProfileBannerBackgroundColor interface{} `json:"profile_banner_background_color"`
			URL                          string      `json:"url"`
			Views                        int         `json:"views"`
			Followers                    int         `json:"followers"`
		} `json:"channel"`
	} `json:"stream"`
}

type Newlive struct {
	Name        *string    `json:"name"`
	ImageID     *string    `json:"imageId"`
	ChannelID   *string    `json:"channelId"`
	Title       *string    `json:"title"`
	Description *string    `json:"description,omitempty"`
	Viewers     int        `json:"viewers"`
	Likes       *string    `json:"likes,omitempty"`
	Dislikes    *string    `json:"dislikes,omitempty"`
	VideoID     *string    `json:"videoId, omitempty"`
	Thumbnail   Thumbnails `json:"thumbnails"`
	DisplayName *string    `json:"displayName,omitempty"`
	IsPlaying   *string    `json:"isPlaying,omitempty"`
	Mature      *bool      `json:"mature, omitempty"`
	Online      bool       `json:"online"`
	Type        string     `json:"type"`
}
type TheStreamers map[string]Streamer

var streamers = []Streamer{
	{Name: "iceposeidon", ChannelId: "UCv9Edl_WbtbPeURPtFDo-uA", ImageID: "ice.jpg", Type: "youtube"},
	{Name: "hyphonixyoutube", ChannelId: "UCaFpm67qMk1W1wJkFhGXucA", ImageID: "hyphonix.jpg", Type: "youtube"},
	{Name: "gary", ChannelId: "UCvxSwu13u1wWyROPlCH-MZg", ImageID: "gary.jpg", Type: "youtube"},
	{Name: "cxnews", ChannelId: "UCStEQ9BjMLjHTHLNA6cY9vg", ImageID: "cxnews.jpg", Type: "youtube"},
	{Name: "jaunbagnell", ChannelId: "UCvhnYODy6WQ0mw_zi3V1h0g", ImageID: "juan.jpg", Type: "youtube"},
	{Name: "codingtrain", ChannelId: "UCvjgXvBlbQiydffZU7m1_aw", ImageID: "coding.jpg", Type: "youtube"},
	{Name: "joerogan", ChannelId: "UCzQUP1qoWDoEbmsQxvdjxgQ", ImageID: "joe.jpg", Type: "youtube"},
	{Name: "mixhound", ChannelId: "UC_jxnWLGJ2eQK4en3UblKEw", ImageID: "mix.jpg", Type: "youtube"},
	{Name: "destiny", Type: "twitch", ImageID: "destiny.jpg"},
	{Name: "richardlewisreports", Type: "twitch", ImageID: "richardlewis.jpeg"},
	{Name: "cjayride", Type: "twitch", ImageID: "cjayride.jpg"},
	{Name: "hitch", Type: "twitch", ImageID: "hitch.jpg"},
	{Name: "rajjpatel", Type: "twitch", ImageID: "rajjpatel.jpg"},
	{Name: "trainwrecksTv", Type: "twitch", ImageID: "trainwreckstv.jpg"},
	{Name: "greekGodx", Type: "twitch", ImageID: "greekgodx.jpeg"},
	{Name: "esfandTV", Type: "twitch", ImageID: "esfandtv.jpeg"},
	{Name: "alecludford", Type: "twitch", ImageID: "alecludford.jpeg"},
	{Name: "knightsinclair", Type: "twitch", ImageID: "knightsinclair.jpg"},
	{Name: "dkane", Type: "twitch", ImageID: "dkane.png "},
	{Name: "hyphonix", Type: "twitch", ImageID: "hyphonixtwitch.jpeg"},
	{Name: "staysafetv", Type: "twitch", ImageID: "staysafetv.png"},
	{Name: "jaycgee", Type: "twitch", ImageID: "jaycgee.png"},
	{Name: "miltontpike1", Type: "twitch", ImageID: "miltontpike1.jpeg"},
	{Name: "mizkif", Type: "twitch", ImageID: "mizkif.jpeg"},
	{Name: "roystang", Type: "twitch", ImageID: "marc.jpeg"},
}

var (
	waiter  sync.WaitGroup
	ch      = make(chan Newlive)
	isDone  = make(chan bool)
	counter int
)

func getStreamData() {
	waiter.Add(len(streamers))
	for _, s := range streamers {
		go s.getData()
	}
	waiter.Wait()
	fmt.Println("waiter done")
	isDone <- true
}
func Listener(h *Hub) {
	payload := []Newlive{}
	for {
		select {
		case data := <-ch:
			payload = append(payload, data)
		case <-isDone:
			sort.Sort(ByViewers(payload))
			Results = payload
			payload = nil
			rz, _ := json.Marshal(Results)
			h.broadcast <- rz
		}
	}
}

type NewStream struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

func (s Streamer) getData() {
	defer waiter.Done()
	results := Newlive{}
	if s.Type == "youtube" {
		url := fmt.Sprintf("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=%v&eventType=live&type=video&key=%v", s.ChannelId, os.Getenv("KEY"))
		resp, err := http.Get(url)
		if err != nil || resp.StatusCode != 200 {
			fmt.Println("youtube req erro")
			fmt.Println(resp)
			return
		}
		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println(err)
		}
		var streamer Islive
		json.Unmarshal(body, &streamer)
		if streamer.PageInfo.TotalResults == 0 {
			results.Name = &s.Name
			results.ImageID = &s.ImageID
			results.ChannelID = &s.ChannelId
			results.Type = s.Type
			results.Viewers = 0
			results.Online = false
			ch <- results
			return
		}
		streamer.Name = s.Name
		streamer.ImageID = s.ImageID

		id := streamer.Items[0].ID.VideoID
		resp, err = http.Get("https://www.googleapis.com/youtube/v3/videos?part=statistics%2C+snippet%2C+liveStreamingDetails&id=" + id + "&key=" + mykey)
		if err != nil || resp.StatusCode != 200 {
			fmt.Println(err)
			return
		}
		body, err = ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println(err)
		}
		defer resp.Body.Close()
		var live Livestream
		json.Unmarshal(body, &live)
		name, err := strconv.Atoi(live.Items[0].LiveStreamingDetails.ConcurrentViewers)
		if err != nil {
			fmt.Println(err)
		}
		thumb := Thumbnails{Low: &live.Items[0].Snippet.Thumbnails.High.URL}
		if len(live.Items[0].Snippet.Thumbnails.Maxres.URL) > 0 {
			thumb.High = &live.Items[0].Snippet.Thumbnails.Maxres.URL
		}

		results.Name = &streamer.Name
		results.ChannelID = &live.Items[0].Snippet.ChannelID
		results.ImageID = &streamer.ImageID
		results.Likes = &live.Items[0].Statistics.LikeCount
		results.Dislikes = &live.Items[0].Statistics.DislikeCount
		results.Title = &live.Items[0].Snippet.Title
		results.Description = &live.Items[0].Snippet.Description
		results.Thumbnail = thumb
		results.Viewers = name
		results.Name = &streamer.Name
		results.VideoID = &live.Items[0].ID
		results.Online = true
		results.Type = "youtube"
		ch <- results
	} else if s.Type == "twitch" {
		url := fmt.Sprintf("https://api.twitch.tv/kraken/streams/%v?client_id=%v", s.Name, os.Getenv("TWITCH"))
		rz, err := http.Get(url)
		if err != nil {
			fmt.Println(err)
		}
		body, err := ioutil.ReadAll(rz.Body)
		defer rz.Body.Close()
		var res TwitchResponse
		json.Unmarshal(body, &res)
		if res.Stream.Channel.Status == nil {
			results.Name = &s.Name
			results.ImageID = &s.ImageID
			results.ChannelID = &s.ChannelId
			results.Type = s.Type
			results.Viewers = 0
			results.Online = false
			ch <- results
			return
		}
		thumb := Thumbnails{High: res.Stream.Preview.Large, Low: res.Stream.Preview.Medium}

		results.ChannelID = &res.Stream.Channel.Name
		results.Name = &res.Stream.Channel.Name
		results.ImageID = &res.Stream.Channel.Logo
		results.VideoID = &res.Stream.Channel.Name
		results.Title = res.Stream.Channel.Status
		results.Viewers = *res.Stream.Viewers
		results.Thumbnail = thumb
		results.DisplayName = &res.Stream.Channel.DisplayName
		results.IsPlaying = res.Stream.Game
		results.Mature = &res.Stream.Channel.Mature
		results.Online = true
		results.Type = "twitch"

		ch <- results
	}
}
