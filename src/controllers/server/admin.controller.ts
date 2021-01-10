const restartServer = async (): Promise<void> => {
  console.log('restarting');
  setTimeout(function () {
    process.on('exit', function () {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('child_process').spawn(process.argv.shift(), process.argv, {
        cwd: process.cwd(),
        detached: true,
        stdio: 'inherit',
      });
    });
    process.exit();
  }, 1000);
};

export { restartServer };
