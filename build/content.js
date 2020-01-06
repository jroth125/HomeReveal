// Good date query is below (gets the last 5 years)
// https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=792%20STERLING%20PLACE&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-01-10T14:00:00%27

//Helper functions


const dateTransformer = theDate => {
  const day =
    String(theDate.getDate()).length < 2
      ? '0' + theDate.getDate().toString()
      : theDate.getDate().toString();
  const month =
    String(theDate.getMonth() + 1).length < 2
      ? '0' + (theDate.getMonth() + 1).toString()
      : (theDate.getMonth() + 1).toString();
  const realDate = `${theDate.getFullYear()}-${month}-${day}`;
  return realDate;
};

const today = dateTransformer(new Date)
const fiveYearsAgo = parseInt(today.split('-')[0]) - 5
const arrayOfToday = today.split('-')
const fiveYearsAgoDate = `${fiveYearsAgo}-${arrayOfToday[1]}-${arrayOfToday[2]}`
console.log('our two things now are: ', fiveYearsAgoDate, today)

function clickHandler(e, complaintData) {
  if (!+e.target.clicked) {
    e.target.innerText = 'Hide';
    let button = e.target;
    e.target.clicked = 1;

    let table = button.parentElement.parentElement;

    let dataTable = document.createElement('table');
    const tableContainer = document.createElement('div');
    if (complaintData[0]) {
      tableContainer.style =
        'width: 500px; overflow: scroll; max-height: 276px; border-width: 1px; border-top: 0px; border-color: black; border-style: dashed; background-color: #FFFBB6; margin-top: 0px; display: flex; justify-content: center; align-content: center;';
      dataTable.innerHTML = `
    <thead> 
        <tr> <td><b style="margin-right: position: sticky; 7px;">Date of Complaint</b></td>  <td><b>Complaint Type</b></td> <td style="padding-left: 15px;"><b>Description</b></td></tr>
    </thead> 
    <tbody style="max-height: 274px;">${complaintData
      .map(incident => {
        let createdDateArr = incident.created_date.split('-');
        let createdDateHuman = `${createdDateArr[1]}/${createdDateArr[0]}`;
        return `<tr>
                <td style="width: 130px;"> ${createdDateHuman}</td>       
                <td style="width: 150px;"> ${incident.complaint_type} </td>
                <td style="padding-left: 15px;">${incident.descriptor[0] +
                  incident.descriptor.slice(1).toLowerCase()}</td>
            </tr>`;
      })
      .join('')}
    </tbody>`;
      e.target.parentElement.style =
        'background-color: #FFFBB6; margin-bottom: 0px; width: 500px; border: 1px black dashed; border-bottom: 0px;';
    } else {
      dataTable.innerHTML = `
    <thead> 
        <tr> <b style='text-align: left'> No complaints to show </b></tr>
    </thead>`;
      tableContainer.style = `width: '${table.width}px'; padding-bottom: 10px; background-color: #FFFBB6; margin-top: 0px; display: flex; justify-content: center; align-content: center;`;
    }
    dataTable.className = 'dataTable';
    tableContainer.id = 'tableContainer';
    tableContainer.appendChild(dataTable);
    table.appendChild(tableContainer);
  } else if (+e.target.clicked) {
    e.target.innerText = 'See all';
    e.target.clicked = 0;
    e.target.parentElement.style =
      'background-color: #FFFBB6; margin-bottom: 0px';
    let article = e.target.parentElement.parentElement;
    let dataTable = article.querySelector('#tableContainer');
    dataTable.remove();
  }
}

const getZipCode = async () => {
  let link = document.getElementsByClassName('details-titleLink')[0].href;
  let res = await fetch(link);
  let htmltext = await res.text();
  let dummy = await document.createElement('div');
  let conventionalSite;
  dummy.innerHTML = htmltext;
  let addressEnd;
  if (dummy.getElementsByClassName('backend_data')[0].children.length === 2) {
    addressEnd = dummy
      .getElementsByClassName('backend_data')[0]
      .getElementsByTagName('span')[0]
      .innerText.split(' ');
    conventionalSite = true;
  } else {
    conventionalSite = false;
    console.log('im here!!');
    addressEnd = dummy
      .querySelector(
        '#content > main > div.row.DetailsPage > article:nth-child(3) > section:nth-child(6) > div > div:nth-child(3) > a'
      )
      .innerText.split(' ');
  }

  let idx = addressEnd.indexOf('NY');
  let boroughZipID = conventionalSite
    ? addressEnd[idx + 1].slice(0, 3)
    : addressEnd[addressEnd.length - 1].slice(0, 3);
  console.log('borough is', boroughZipID);
  return boroughZipID;
};

const getCurrentBorough = currentZipCode => {
  switch (currentZipCode) {
    case '100':
      return 'MANHATTAN';
    case '112':
      return 'BROOKLYN';
    case '103':
      return 'BRONX';
    default:
      return 'QUEENS';
  }
};

chrome.storage.sync.get(['homeRevealOn'], async result => {
  if (result.homeRevealOn) {
    const pathNames = location.pathname.split('/');
    if (
      pathNames[1].split('-')[pathNames[1].split('-').length - 1] === 'rent'
    ) {
      let state = '';
      let items = Array.from(document.getElementsByClassName('item'));

      const currentZipCode = await getZipCode();
      let currBorough;
      switch (currentZipCode) {
        case '100':
          currBorough = 'MANHATTAN';
          break;
        case '112':
          currBorough = 'BROOKLYN';
          break;
        case '103':
          currBorough = 'BRONX';
          break;
        default:
          currBorough = 'QUEENS';
      }

      items.forEach(async item => {
        let address = item.getElementsByClassName('details-titleLink')[0];
        if (address) {
          address = address.innerText.split(' ');
          address.pop();
          address = address.join(' ').toUpperCase();
          const response = await fetch(
            `https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=${address}&$where=created_date%20between%20%27${fiveYearsAgoDate}T12:00:00%27%20and%20%27${today}T14:00:00%27&borough=${currBorough}&location_type=RESIDENTIAL BUILDING`
          );
          const myJson = await response.json();
          let dataLength = myJson.length ? myJson.length : 'No';

          let linkToPopUp = document.createElement('a');

          linkToPopUp.innerText = `${dataLength} complaints`;
          linkToPopUp.style = 'padding-top: 40px;';
          linkToPopUp.id = address;
          linkToPopUp.name = currBorough;
          const listContainer = document.createElement('li');
          const complaintInfo = document.createElement('div');
          complaintInfo.className = 'details_info';
          complaintInfo.style = myJson.length
            ? 'background-color: #FFFBB6; margin-bottom: 0px; display: flex; justify-content: space-between; flex-direction: row;'
            : null;
          complaintInfo.innerHTML = `<span>${dataLength} complaints against this building</span> ${
            myJson.length
              ? `<button style="padding: 3px 0px; margin-top: 4px;"><a name="${currBorough}" id="${address}" style="padding: 5px 20px">See more</a></button>`
              : ''
          }`;
          if (myJson.length) {
            complaintInfo.children[1].addEventListener('click', showComplaints);
          }
          listContainer.appendChild(complaintInfo);
          item.getElementsByTagName('ul')[0].appendChild(listContainer);
        }
      });

      const showComplaints = async e => {
        if (!+e.target.clicked) {
          let button = e.target;
          console.log('target is', e.target);
          e.target.clicked = 1;
          let currBorough = button.name;
          let address = button.id;
          let table = button.parentElement.parentElement.parentElement;
          const data = await fetch(
            `https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=${address}&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-11-10T14:00:00%27&borough=${currBorough}&location_type=RESIDENTIAL BUILDING`
          );
          const json = await data.json();
          console.log('data is', json);
          const jsonData = json.reverse();
          const tableContainer = document.createElement('div');
          const endNote = document.createElement('p');
          let dataTable = document.createElement('table');
          if (json[0]) {
            dataTable.innerHTML = `
          <thead> 
              <tr> <td><b style="margin-right: 7px;">Date of Complaint</b></td>  <td><b>Complaint Type</b></td></tr>
          </thead> 
          <tbody>${jsonData
            .map(incident => {
              let createdDateArr = incident.created_date.split('-');
              let createdDateHuman = `${createdDateArr[1]}/${createdDateArr[0]}`;
              return `<tr>
                      <td style="margin-right: 7px;"> ${createdDateHuman}</td>       
                      <td> ${incident.complaint_type} </td>
                  </tr>`;
            })
            .join('')}
            <tr/>
          </tbody>`;
          } else {
            dataTable.innerHTML = `
          <thead> 
              <tr> <b style='text-align: center;'> No complaints to show </b></tr>
          </thead>`;
          }
          endNote.innerText =
            'Data taken from NYC Open Data on all residential 311 building complaints made in the last five years';
          tableContainer.className = 'dataTable';
          dataTable.style = 'overflow: scroll; max-height: 276px;';
          tableContainer.style =
            'display: flex; justify-content: center; align-content: center; background-color: #FFFBB6';
          tableContainer.appendChild(dataTable);
          table.appendChild(tableContainer);
        } else if (+e.target.clicked) {
          e.target.clicked = 0;
          let article = e.target.parentElement.parentElement.parentElement;
          let dataTable = article.querySelector('.dataTable');
          dataTable.remove();
        } else {
          console.log('HERE THREE');
        }
      };
    } else if (
      (pathNames[1] === 'building' && pathNames[3]) ||
      (pathNames[1] === 'rental' && pathNames[2])
    ) {
      let addressEnd;
      let conventionalSite;
      if (
        document.getElementsByClassName('backend_data')[0].children.length === 2
      ) {
        console.log(
          'the backend Data is:',
          document.getElementsByClassName('backend_data')[0].children
        );
        addressEnd = document
          .getElementsByClassName('backend_data')[0]
          .getElementsByTagName('span')[0]
          .innerText.split(' ');
        conventionalSite = true;
      } else {
        addressEnd = document
          .querySelector(
            '#content > main > div.row.DetailsPage > article:nth-child(3) > section:nth-child(6) > div > div:nth-child(3) > a'
          )
          .innerText.split(' ');
        conventionalSite = false;
      }
      let boroughZipID = addressEnd.pop().slice(0, 3);
      console.log('the borough is', addressEnd, boroughZipID);
      const currBorough = getCurrentBorough(boroughZipID);

      let simpleAddress = conventionalSite
        ? document
            .querySelector('main')
            .querySelector('.incognito')
            .innerText.split(' ')
        : document
            .querySelector(
              '#content > main > div.row.DetailsPage > article:nth-child(3) > section:nth-child(6) > div > div:nth-child(3) > a'
            )
            .innerText.split(',')[0];

      console.log('and it is:', simpleAddress);
      conventionalSite ? simpleAddress.pop() : null;
      simpleAddress = conventionalSite
        ? simpleAddress.join(' ').toUpperCase()
        : simpleAddress.toUpperCase();

      let complaintData;
      fetch(
        `https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=${simpleAddress}&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-11-10T14:00:00%27&borough=${currBorough}&location_type=RESIDENTIAL BUILDING`
      ).then(data => {
        data.json().then(jsonData => {
          console.log(
            'the fetch call was:',
            `https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=${simpleAddress}&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-11-10T14:00:00%27&borough=${currBorough}&location_type=RESIDENTIAL BUILDING`
          );
          console.log('the complaint data is...', jsonData);

          const complaints = document.createElement('div');
          complaints.className = 'details_info';
          complaints.innerHTML = `<span class="nobreak" style="color: ${
            jsonData.length ? 'red' : 'black'
          }; font-size: 16px; margin-left: 5px"><b>${
            jsonData.length
          } building complaints</b> (last 5 years)</span> 
          ${
            jsonData.length
              ? '<button id="dataButton" clicked="0" style="width: 90px; height: 30px; font-size: 14px; margin: 8px 0px 4px 8px;">See more</button>'
              : ''
          }`;
          complaints.style = `background-color: ${
            jsonData.length ? '#FFFBB6' : 'white'
          };`;

          const holdingDiv = document.getElementsByClassName('details')[0];
          holdingDiv.appendChild(complaints);
          complaints.querySelector('#dataButton').onclick = e =>
            clickHandler(e, jsonData.reverse());
        });
      });
    } else if (pathNames[1] === 'building' && !pathNames[3]) {
      const complaintListItem = document.createElement('li');
      const simpleAddress = document
        .querySelector('article.right-two-fifths.main-info > h2')
        .innerText.split(',')[0]
        .toUpperCase();
      let currBorough = document
        .querySelector('article.right-two-fifths.main-info > h2')
        .innerText.split(',')[1]
        .toUpperCase();

      let complaintData;
      fetch(
        `https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=${simpleAddress}&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-11-10T14:00:00%27&borough=${currBorough}&location_type=RESIDENTIAL BUILDING`
      ).then(data => {
        data.json().then(jsonData => {
          console.log(
            'the fetch call was:',
            `https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=${simpleAddress}&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-11-10T14:00:00%27&borough=${currBorough}&location_type=RESIDENTIAL BUILDING`
          );
          console.log('the complaint data is...', jsonData);

          const complaints = document.createElement('div');
          complaints.className = 'details_info';
          complaints.innerHTML = `<span class="nobreak" style="color: red; font-size: 16px; margin-left: 5px"><b>${
            jsonData.length
          } building complaints</b> (last 5 years)</span> 
      ${
        jsonData.length
          ? '<button id="dataButton" clicked="0" style="width: 90px; height: 30px; font-size: 14px; margin: 8px 0px 4px 8px;">See more</button>'
          : ''
      }`;
          complaints.style = 'background-color: #FFFBB6; margin-bottom: 0px';

          const mainContainer = document.querySelector(
            'article.right-two-fifths.main-info'
          );
          mainContainer.appendChild(complaints);
          complaints.querySelector('#dataButton').onclick = e =>
            clickHandler(e, jsonData.reverse());
        });
      });
    }
  }
});
