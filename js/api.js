var base_url = "https://api.football-data.org/v2/";
var api_key = "9620be29cf5342b7b0762abb3142c6d4"

// Table UCL
const ucl_id = 2019

const competitionUcl = `${base_url}competitions/${ucl_id}/standings`
const clubList = `${base_url}competitions/${ucl_id}/teams`

const fetchApi = url => {
  return fetch(url, {
    headers: {
      'X-Auth-Token': api_key
    }
  })
    .then(res => {
      if (res.status !== 200) {
        console.log("Error: " + res.status)
        return Promise.reject(new Error(res.statusText))
      } else {
        return Promise.resolve(res)
      }
    })
    .then(res => res.json())
    .catch(err => {
      console.log(err)
    })
}

function getAllStandings() {
  if ("caches" in window) {
    caches.match(competitionUcl).then(response => {
      if (response) {
        response.json().then(data => {
          console.log("Competition Data: " + data);
          showStanding(data);
        })
      }
    })
  }
  fetchApi(competitionUcl)
    .then(data => {
      console.log(data)
      showStanding(data);
    })
    .catch(error => {
      console.log(error)
    })
}

const showStanding = (data) => {
  let standings = "";
  let standingElement = document.getElementById("competitions");
  data.standings[0].table.forEach((standing) => {
        standings += `
                  <tr>
                  <td>
                      <img class="lazyload" src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="badge"/>
                  </td>
                  <td>${standing.team.name}</td>
                  <td>${standing.won}</td>
                  <td>${standing.draw}</td>
                  <td>${standing.lost}</td>
                  <td>${standing.points}</td>
                  <td>${standing.goalsFor}</td>
                  <td>${standing.goalsAgainst}</td>
                  <td>${standing.goalDifference}</td>
              </tr>`;

  });

  standingElement.innerHTML = `
        <div class="card">
          <table class="striped responsive-table">
              <thead>
                <tr>
                <th></th>
                <th>Team Name</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>P</th>
                <th>GF</th>
                <th>GA</th>
                <th>GD</th>
                </tr>
              </thead>
              <tbody id="standings">
                  ${standings}
              </tbody>
            </table>
      </div>
      `
}

const getClubList = () => {
  if ("caches" in window) {
    caches.match(clubList).then(response => {
      if (response) {
        response.json().then(data => {
          console.log("Club list: " + data);
          showClubList(data);
        })
      }
    })
  }
  fetchApi(clubList)
  .then(data => {
    console.log(data)
    showClubList(data);
  })
  .catch(error => {
    console.log(error)
  })
}

const showClubList = (data) => {
  let teams = "";
  let teamsElement = document.getElementById("club");
  data.teams.id.map(team => {
      teams += `
      <div class="card">
        <a href="./club.html?id=${team.id}">
          <div class="card-image waves-effect waves-block waves-light">
            <img src="${team.crestUrl.replace(/^http:\/\//i, 'https://')}" />
          </div>
        </a>
        <div class="card-content">
          <span class="card-title center">${team.name}</span>
          <p>${team.shortName}</p>
          <p>${team.founded}</p>
          <p>${team.clubColors}</p>
          <p>${team.venue}</p>
        </div>
      </div>
      `
    })
  teamsElement.innerHTML = teams
}
