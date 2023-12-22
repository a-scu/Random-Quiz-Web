const calculateUploadDate = (timestamp) => {
  const fechaActual = new Date();

  const diferenciaEnMilisegundos = fechaActual.getTime() - timestamp;

  const segundos = Math.floor(diferenciaEnMilisegundos / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  let message = "";

  if (dias > 0) {
    message = dias === 1 ? "A day ago" : `${dias} days ago`;
  } else if (horas > 0) {
    message = horas === 1 ? "An hour ago" : `${horas} hours ago`;
  } else if (minutos > 0) {
    message = minutos === 1 ? "A minute ago" : `${minutos} minutes ago`;
  } else {
    message = "Now";
  }

  return message;
};

export default calculateUploadDate;
