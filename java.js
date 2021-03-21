// ##########################################
// ## 
// ##  Countdown Scripted by Cecconi Luca
// ##
// ##########################################

//controllo in cui memorizzerÃ² i valori giorno, ora, min, sec
var precedente = new Array();
	precedente[0] = ""; //secondo
	precedente[1] = ""; //minuto
	precedente[2] = ""; //ora
	precedente[3] = ""; //giorno

var timer;

var studiato, materiali = 0;
	
function setProgress(progress ,giorno_si_no, id)
{
	var progressBarWidth;           
    if(giorno_si_no=="si") progressBarWidth =progress*4.166666666666667;/// 100;
	else if(giorno_si_no=="no") progressBarWidth =progress*1.666666666666667;  
	else progressBarWidth =progress*3.225806451612903;
	
    $("."+id).animate({width:progressBarWidth+"%"},"slow");
}

function crea_countdown(id_avviso, tempo_start, intervallo, studio, url)
{
	//inizializzo le variabili per il calcolo dei giorni e dell'orario
	var giorni = ore = minuti = secondi = 0;
	
	var studiati;
	if(studio==true) studiati = studiato;
	else if(studio ==false) studiati = "";	
	//conto il tempo in secondi inserito e ricavo giorni, ore, minuti e secondi
	for(i=0; i<tempo_start; i++)
	{
		//conta i secondi
		secondi++;
		
		//calcola i minuti
		if(secondi == 60){secondi = 0; minuti++;}
		//calcola le ore
		if(minuti == 60){minuti = 0; ore++;}
		//calcola i giorni
		if(ore == 24){ore = 0; giorni++;}
	}
	
	//document.write("<br/> giorno : "+precedente[3]+"<br/> ore :"+precedente[2]+"<br/> minuti :"+precedente[1]+"<br/> secondi : "+precedente[0]+"<br/>");
	//setto il risultato del calcolo giorni, ore , minuti e secondi a 2 digit nel caso il risultato fosse inferiore a 10
	if(secondi.toString().length < 2) { secondi = '0'+secondi.toString();}
	if(minuti.toString().length < 2) { minuti = '0'+minuti.toString(); }
	if(ore.toString().length < 2) { ore = '0'+ore.toString(); }
	if(giorni.toString().length < 2) { giorni = '0'+giorni.toString(); }
	
	//controllo tramite l'array precedente se i valori di giorno, ora, min , sec sono cambiati 
	//qualora fossero cambiati avvia l'update della barra che necessita l'aggiornamento del valore
	if(secondi != precedente[0]){ setProgress(secondi,"no","sec_bar");  precedente[0] = secondi;}
	if(minuti != precedente[1]) { setProgress(minuti,"no","min_bar");   precedente[1] = minuti;} 
	if(ore != precedente[2])    { setProgress(ore,"si","ore_bar");      precedente[2] = ore;} 
	if(giorni != precedente[3]) { setProgress(giorni,"mese","day_bar"); precedente[3] = giorni;} 
	
	//decremento di 1 il tempo
	tempo_start--;
	
	//passo il valore giorni, ora, min, sec al visualizzatore
	$(".day_view").html(giorni);
	$(".ore_view").html(ore);
	$(".min_view").html(minuti);
	$(".sec_view").html(secondi);
	
	//controllo che il tempo sia superiore o uguale a 0
	if(tempo_start >= 0)
	{
		//imposto il tempo di aggiornamento e ripeto la funzione
		 timer = window.setTimeout("crea_countdown('"+id_avviso+"',"+tempo_start+","+intervallo+","+studio+","+url+")", intervallo);
		 
		 //messaggio di avviso che mancano 60 secondi al termine
		 if(tempo_start == 60 && studio == false) $("#"+id_avviso).html("<span style='color:#F90; background:#fff; border:#000 solid 1px;  position:fixed; left:50%; right:50%; margin-left:-155px; width:300px; top:10px; -webkit-border-radius: 10px; -moz-border-radius: 10px; border-radius: 10px; padding:5px;'>1 min al termine della prova</span>").fadeIn("slow").children("span").delay(3000).fadeOut("slow");
	}
	else //se il tempo Ã¨ scaduto
	{
		if(studio==true){
			if(studiati==materiali)
			{
				avviso = "<h2>Sostieni l'esame</h2>";
				$("#avviso").html(avviso);
									
				$("#div_continua").html('<a href="https://formazioneweb.it/esame.php?id_corso='+url+'" style="padding:15px 25px; -webkit-border-radius: 10px; -moz-border-radius: 10px; border-radius: 10px; display:block; cursor:pointer; background:#208cbf; text-align:center; display:block; color:#FFF; width:310px; text-decoration:none;">EFFETTUA L\'ESAME</a>').fadeIn(500);
				$("#tempo").hide(0);
			}
			else 
			{
				avviso = "<h2>Studio necessario per continuare</h2>";
				$("#tempo").hide(0);
				$("#avviso").html(avviso);
			}
		}
		else if(studio==false)
		{
			$("input[type=radio]").prop('disabled', true);
			
			//messaggio di avviso
		    //if(tempo_start == 0 && studio == false) 
			$("#"+id_avviso).html("<span style='color:#c00; background:#fff; border:#000 solid 1px;  position:fixed; left:50%; right:50%; margin-left:-155px; width:300px; top:10px; -webkit-border-radius: 10px; -moz-border-radius: 10px; border-radius: 10px; padding:5px;'>Il tempo Ã¨ scaduto</span>").fadeIn("slow").children("span").delay(3000).fadeOut("slow");
			
// ######### CONTROLLO ESAME ############################
		var form_data = $("#verifica_form").serialize();
		form_data += $.map($("input:radio:checked"), function(elem, idx){
			return "&"+$(elem).attr("name")+"="+ $(elem).val();
		}).join('');
		
$.ajax({
	url:"controller/verifica_esame1.php",
	type:"POST",
	data: form_data,
	dataType:"json",
	beforeSend: function(){
		$("#verifica_load").show(0);
		$("#verifica").hide(0);
	},
	success: function(e){
		
		$("#test").html(e.valutazione+" "+e.esito).delay(3000).fadeOut("fast");
		$("#verifica_load").hide(0);
		$("#start_timer").hide(0);
		if(e.esito=="NEGATIVO"){
			$("#attesa_esame").show();
			attesa_esame(e.data_nuova);
			$("#pagamento_esame").hide(0);
		}
		else{
			$("#pagamento_esame").show(0);
			$("#start_esame").hide(0);
		}	
		$("input[type=radio]").prop('disabled', true);
		$("#esito_domande").html(e.domande).show();
		$("#esame_questionario").fadeOut("fast");
		
		//attesa_esame(e.data_nuova);
	},
	error: function (xhr, ajaxOptions, thrownError) {
        alert(xhr.status);
        alert(thrownError);
     }
});

		//$("#test").html(form_data);
// ######################################################
		}
	}
}

function aggiorna_studio(studiato, n_materiali)
{
	studiato = studiato;
	materiali = n_materiali;
	//alert(studiato+" | "+materiali);
}

function ferma_timer()
{
	window.clearTimeout(timer);
}

function attesa_esame(tempo_start)
{
	//inizializzo le variabili per il calcolo dei giorni e dell'orario
	var giorni = ore = minuti = secondi = 0;
	
	//conto il tempo in secondi inserito e ricavo giorni, ore, minuti e secondi
	for(i=0; i<tempo_start; i++)
	{
		//conta i secondi
		secondi++;
		
		//calcola i minuti
		if(secondi == 60){secondi = 0; minuti++;}
		//calcola le ore
		if(minuti == 60){minuti = 0; ore++;}
		//calcola i giorni
		if(ore == 24){ore = 0; giorni++;}
	}
	
	//setto il risultato del calcolo giorni, ore , minuti e secondi a 2 digit nel caso il risultato fosse inferiore a 10
	if(secondi.toString().length < 2) { secondi = '0'+secondi.toString();}
	if(minuti.toString().length < 2) { minuti = '0'+minuti.toString(); }
	if(ore.toString().length < 2) { ore = '0'+ore.toString(); }
	if(giorni.toString().length < 2) { giorni = '0'+giorni.toString(); }
	
	//controllo tramite l'array precedente se i valori di giorno, ora, min , sec sono cambiati 
	//qualora fossero cambiati avvia l'update della barra che necessita l'aggiornamento del valore
	if(secondi != precedente[0]){ setProgress(secondi,"no","sec_bar2");  precedente[0] = secondi;}
	if(minuti != precedente[1]) { setProgress(minuti,"no","min_bar2");   precedente[1] = minuti;} 
	if(ore != precedente[2])    { setProgress(ore,"si","ore_bar2");      precedente[2] = ore;} 
	if(giorni != precedente[3]) { setProgress(giorni,"mese","day_bar2"); precedente[3] = giorni;} 
	
	//decremento di 1 il tempo
	tempo_start--;
	
	//passo il valore giorni, ora, min, sec al visualizzatore
	$(".day_view2").html(giorni);
	$(".ore_view2").html(ore);
	$(".min_view2").html(minuti);
	$(".sec_view2").html(secondi);
	
	//controllo che il tempo sia superiore o uguale a 0
	if(tempo_start >= 0)
	{
		//imposto il tempo di aggiornamento e ripeto la funzione
		 window.setTimeout("attesa_esame("+tempo_start+")", 1000);
	}
	else
	{
		$("#esito_domande").fadeOut("fast");
		$("#start_esame").show(0);
		$("#attesa_esame").hide(0);
	}
}
