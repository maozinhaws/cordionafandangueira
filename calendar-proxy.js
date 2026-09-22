import { google } from 'googleapis';
export async function calendarEvents(req,res){
  try{
    const calendarId=process.env.CALENDAR_ID;
    if(!calendarId) return res.status(500).json({error:'CALENDAR_ID not configured'});
    const auth=new google.auth.GoogleAuth({scopes:['https://www.googleapis.com/auth/calendar.events.public.readonly']});
    const calendar=google.calendar({version:'v3',auth});
    const r=await calendar.events.list({calendarId,timeMin:req.query.timeMin,timeMax:req.query.timeMax,singleEvents:true,orderBy:'startTime',maxResults:100});
    res.set('Cache-Control','public,max-age=60,s-maxage=300');
    res.json({events:r.data.items||[]});
  }catch(e){res.status(500).json({error:'calendar_unavailable'});}
}