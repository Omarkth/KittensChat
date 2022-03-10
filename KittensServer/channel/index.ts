import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { RtcTokenBuilder, RtcRole } from 'agora-access-token'

// Fill the appID and appCertificate key given by Agora.io
var appID = '5165b965ecc54b389944f33db323f944';
var appCertificate = '6c880818d7aa43bc9c3662a857583f8b';

// token expire time, hardcode to 3600 seconds = 1 hour
var expirationTimeInSeconds = 3600
var role = RtcRole.PUBLISHER

var generateRtcToken = function (req, resp) {
    var currentTimestamp = Math.floor(Date.now() / 1000)
    var privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
    var channelName = req.query.channelName;
    // use 0 if uid is not specified
    var uid = req.query.uid || 0
    if (!channelName) {
        return resp.status(400).json({ 'error': 'channel name is required' }).send();
    }

    var key = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);

    resp.header("Access-Control-Allow-Origin", "*")
    //resp.header("Access-Control-Allow-Origin", "http://ip:port")
    return resp.json({ 'key': key }).send();
};

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    // const name = (req.query.name || (req.body && req.body.name));
    // context.log(`*** HTTPExample name: ${name}`);
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    // context.res = {
    //     // status: 200, /* Defaults to 200 */
    //     body: responseMessage
    // };

    generateRtcToken(req, context.res);

};

export default httpTrigger;