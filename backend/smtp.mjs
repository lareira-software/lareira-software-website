import nodemailer from 'nodemailer';
export function smtpOptions(env=process.env){
 for(const k of ['SMTP_HOST','SMTP_USER','SMTP_PASS'])if(!env[k])throw new Error('Missing '+k);
 if(/[\s\x00-\x1f]/.test(env.SMTP_HOST))throw new Error('Invalid SMTP_HOST');
 const port=Number(env.SMTP_PORT||587);if(![465,587].includes(port))throw new Error('SMTP_PORT must be 465 or 587');
 return {host:env.SMTP_HOST,port,secure:port===465,requireTLS:port!==465,tls:{rejectUnauthorized:true,minVersion:'TLSv1.2'},auth:{user:env.SMTP_USER,pass:env.SMTP_PASS},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000,logger:false,debug:false,disableFileAccess:true,disableUrlAccess:true};
}
export const createSmtpTransport=(env=process.env)=>nodemailer.createTransport(smtpOptions(env));
