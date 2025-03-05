const cheerio = require('cheerio');

async function getData(route, date) {

    //Parameters for the POST request
    const fromData = new URLSearchParams();
    fromData.append('deriction', route);
    fromData.append('way_date', date);

    //fetch page from url
    const response = await fetch("https://stolica-express.by/?ysclid=m7q3poyfpm822681001", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: fromData.toString(),
    });

    //convert response into text
    const text = await response.text();
    
    //load body datanode
    const $ = cheerio.load(text);

    const data = [];

    //loop over each tr
    $('table tbody tr.tr').each((index, element) => {
        //get time and seats
        const time = $(element).find('td').eq(0).text();
        const seats = $(element).find('td').eq(1).text();

        data.push({
            time,
            seats,
        });
    });
    return data;
}

async function checkSeats(route, date) {
    const data = await getData(route, date);
    const availableSeats = data.filter(item => item.seats !== '0');
    return availableSeats ? availableSeats : null;
}

function startChecking(route, date) {
    return new Promise(resolve =>{
        const intervalId = setInterval(async () => {
            const availableSeats = await checkSeats(route, date);
            if(availableSeats) {
                clearInterval(intervalId);
                // console.log(availableSeats);
                // console.timeEnd('Execution Time');
                resolve(availableSeats);
            }
        }, 1000);
    })

}

// console.time('Execution Time');
// startChecking('Любань-Минск', '05-03-2025');

module.exports = { startChecking };