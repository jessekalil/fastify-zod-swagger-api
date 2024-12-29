import { app } from './app';

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.fatal(err);
    process.exit(1);
  }
  app.log.info(`Server listening at ${address}`);
});
