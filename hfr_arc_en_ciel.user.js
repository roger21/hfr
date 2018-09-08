// ==UserScript==
// @name          [HFR] Arc-en-ciel
// @version       1.2.0
// @namespace     roger21.free.fr
// @description   Permet de colorer le texte sélectionné en arc-en-ciel avec ctrl+alt+g dans les zones d'édition et de rédaction des posts.
// @icon          http://reho.st/self/40f387c9f48884a57e8bbe05e108ed4bd59b72ce.png
// @include       https://forum.hardware.fr/*
// @author        roger21
// @homepageURL   http://roger21.free.fr/hfr/
// @noframes
// @grant         none
// ==/UserScript==

// $Rev: 421 $

// historique :
// 1.2.0 (12/08/2018) :
// - nouveau nom : [HFR] arc en ciel -> [HFR] Arc-en-ciel
// - ajout de la metadata @author (roger21)
// 1.1.3 (13/05/2018) :
// - check du code dans tm
// - maj de la metadata @homepageURL
// 1.1.2 (07/04/2018) :
// - suppression des @grant inutiles (tous)
// 1.1.1 (07/04/2018) :
// - nouveau bouton par Heeks
// 1.1.0 (07/04/2018) :
// - ajout d'un bouton dans l'interface d'édition de la réponse normale (en mode standard) ->
// sur une proposition de Kiks67
// - gestion des sélections de 1 caractère
// - reformatage du code (Online JavaScript beautifier : ->
// "2 spaces, unlimited newlines, do not wrap, braces with" et rien coché)
// 1.0.6 (28/11/2017) :
// - passage au https
// 1.0.5 (17/09/2015) :
// - modification de l'année dans les dates de l'historique : passage de 2 a 4 chiffres
// 1.0.4 (07/03/2015) :
// - ajout de la metadata @noframes (interdit l'execution du script dans une frame pour plus de sécurité)
// 1.0.3 (04/04/2014) :
// - modification de la description
// - ajout d'une icone au script
// - ajout des dates dans l'historique
// 1.0.2 (18/03/2014) :
// - maj des metadata @grant et indentation des metadata
// 1.0.1 (14/09/2013) :
// - ajout des metadata @grant
// 1.0.0 (15/08/2013) :
// - première mouture (avec tous les bugs qui vont bien :o)

function colorize(value) {
  var indice = parseInt(value / 255);
  value = parseInt(value % 255);

  function pad(value) {
    var color = "";
    color = value.toString(16);
    color = value < 16 ? "0" + color : color;
    return (color);
  }

  var color = "";
  switch (indice) {
    case 0:
      color = "ff" + pad(value) + "00";
      break;
    case 1:
      color = pad(255 - value) + "ff00";
      break;
    case 2:
      color = "00ff" + pad(value);
      break;
    case 3:
      color = "00" + pad(255 - value) + "ff";
      break;
    case 4:
      color = pad(value) + "00ff";
      break;
    case 5:
      color = "ff00ff";
      break;
  }
  return (color);
}

function rainyday(e) {
  if(e.keyCode == 71 && e.ctrlKey && e.altKey) {
    var start = e.target.selectionStart;
    var end = e.target.selectionEnd;
    var size = end - start;
    var value = e.target.value;
    var selection = value.substring(start, end);
    var arcenciel = "";
    if(size > 1) {
      var step = (255 * 5) / (size - 1);
      for(let i = 0; i < size; ++i) {
        var color = colorize(i * step);
        arcenciel += "[#" + color + "]" + selection[i] + "[/#" + color + "]";
      }
    }
    if(size === 1) {
      arcenciel = "[#ff0000]" + selection + "[/#ff00ff]";
    }
    e.target.value = value.substring(0, start) + arcenciel + value.substring(end);
  }
}

if(document.getElementById("content_form")) {
  document.getElementById("content_form").addEventListener("keydown", rainyday, false);
}

var observer = new MutationObserver(function(mutations, observer) {
  /*mutations.forEach(function(mutation){
    console.log(mutation.type);
    console.log(mutation.target);
    console.log(mutation.addedNodes);
    console.log(mutation.removedNodes);
    });*/
  var textareas = document.querySelectorAll("textarea[id^=\"rep_editin_\"]");
  if(textareas.length) {
    for(var textarea of textareas) {
      textarea.removeEventListener("keydown", rainyday, false);
      textarea.addEventListener("keydown", rainyday, false);
    }
  }
});
observer.observe(document, {
  attributes: false,
  childList: true,
  characterData: false,
  subtree: true
});

var frogimg = "data:image/gif;base64,R0lGODlhRQAcAPf%2FAMzMzP8dAPsSEu1LS%2F%2BLAM%2B%2BvjP%2FAOtSUv%2BlAP%2F%2FAIhd8P%2Bd%2Fxr%2FAP%2BN8f995Le3t8XA0HhOAP81AP9sAP9zAfp6E4ROTt9%2Ff2aCACr6FBvqNVz6FGn%2FAP%2BTALn%2FAP%2FcAfrfFM%2F%2FAP%2FhAPr6FHsf%2F3w7%2Bjhj%2F0Rb%2F1Vm%2Boxk7pRx6h%2B%2FlRrHhCPEjDTClwOqzwCp1hGH%2FwCl5xSg%2BtmXl9eiosC50v%2FB%2F3kNAf8iACv%2FAISDANr%2FAJmFW5%2BfX6mzkqGIrqWUq6uNt6Spuf%2F4x%2F%2F9ANT%2FAP%2BJ9v%2Br%2F0VEM%2F8BAZV2Z5d%2BY5V2apV8a%2BhcXBz5Ehj0H1P%2FAFz%2FAP%2BrAP%2ByAP%2B6AP%2F7AHUl%2F3wh%2F2E6%2FwCb%2F9K0tNG6uquX3aOK4v%2BE5v%2Bb8v%2BT%2Bv%2Ba%2F7u7u%2F%2BF8%2F%2Bx%2F8HBwQ0YCyAdDhklDyUoFTAtGy06EjAbMy0tLSk2JTc4NUs4OmIvIBdKACVUEwZ4EStpEjVnHy9KIDFXITpGNDRTNz1iJzVuIjZgKDZoKDt4KGpKJ21ZLWdeMHZeMEVsLklzIUFsOERxMEt1NU95N2dkLnR0OCINVSEiQ0k%2BRwBJf0RHRExMS15DTUpSRlpeV2tSQkxkQFV7Rn1iRGF7UmRkZGhsZm9vb210anNzc351c3t6eoU4JfsPD4FcL4BuN4t%2FPg%2BAADKEIEuFAEaCJEGRJUqKNVKFNVyMPlSaP2ONPhz7DRX8F1icQmCGRGWcR22IWVynRmWoSGCpU3qEdd7%2FAEkln35OhGcz%2F2c2%2F2g4%2FwJv0XBZ03tgx6FPooNW84BT9IZa8v9n1v9z3v953%2F9l4v9y7%2F987AuR%2FwmX%2FwC%2F6oODg4%2BPj5SUlJ2emqioqK6trbCwsLazs7OztLm6ub6%2BvtSVg8Sar8aIteqruezRlP%2F%2FvtaD3uusx%2BKiyOGvyemvyOy4zf%2BE6%2F%2BI7%2F%2BM7O2L8f%2BC%2Bf%2BN%2BP%2BP%2Ff%2BQ9P%2BS%2F%2F%2BV%2Fv%2BY%2B%2F%2BY%2F%2F%2Bi%2F%2F%2Bn%2FP%2B5%2FsbFxcnJyf%2Fd6fL28P%2Bl%2FzFmGf%2By%2Fw8aCCH%2FC05FVFNDQVBFMi4wAwEAAAAh%2FhlPcHRpbWl6ZWQgdXNpbmcgZXpnaWYuY29tACH5BAQJAP8ALAAAAABFABwAhwA6jACc%2FwCl%2FwCo1wKp0wSm3AaDAAmP%2FwplQAqU%2Fw0kCg8aCBE2BBFBKxSs0hUqDBf%2FABkmFRlPCRnKfxrQkRv5ERv%2FAB46ER7VaR76Dh%2BZ%2Bh%2FzHSHAkiH%2FACMUEyMhHSMuHyNOxSO%2BliPGiycmJSc8GyktJykyKyps%2FystKitOFC0dMC31Ii4yHS9ZJDBPITE4LzJFITM6HzP%2FADRXIzV8ADkoJTmDJTpgIzp7Hjs8OTxQMTxoJEA4G0JQOkP6FEVb%2F0VlNEVuL0V8NUWEN0aGLEaMNEc2L0dKR0hj%2FkiLMEv%2FAExTSk6KOVH%2FAFOaPlVXTFZZVlZ6Nlg6WViGO1mBRVmnOVr%2FAFuQQF1qWF%2BeQGBgXmI5%2F2J3OWKCO2X%2FAGilSWkM5GlpZmpqNGxdMGyvK213bHEo%2F3JfMXNSLXNkM3Um%2F3YAAXZJ%2BHZzOHc3AHf%2FAHhPAHog%2F3p8eHtHKXtwAHt6g3we%2F3yQQX0%2FJn6GAH9a2oFWLoJT9IMj%2F4NY8oX%2FAIZ7d4hd8Ipi74qKio0zI42mfo6XiI%2Bhg5Jp7pKTkpNw6pOZmJmZmZq7iZ2dnKBrkKFFpKF2lKGknqRXWKenp6mJjaqxcbS3srWRh7Wm2bZyl7aUjLubkbu7u7ydgr%2BkbsF8xsG50sHBwcJxocO%2Fz8PExMTExMZqyMd%2BdsfCz8rKyszMzM2TQ8%2B%2BvtG3t9NixNPW0tSsrNT%2FANaE1dedrdfDfdidp9ifqNigqtijrdmuoNn6FNqUlN7Aht%2F%2FAOVmZuWD5uheXunIietSUu1LS%2FcgIPqRFPqsFPrUpfr3FPsODvsSEv8AAP8dAP8iAv9WAP9iAP9j2v9s1f9tAP9w3%2F91AP995f997v9%2F%2B%2F%2BC%2FP%2BF7f%2BF8%2F%2BJ6f%2BJ9v%2BK8P%2BLAP%2BN8P%2BN9f%2BO%2Bf%2BR%2BP%2BS9f%2BS%2Fv%2BV%2Bv%2BW%2F%2F%2BZ9P%2Ba%2Fv%2BdAP%2Bd%2F%2F%2Bi%2Fv%2BlAP%2Bl%2F%2F%2BqAP%2Br%2F%2F%2BuAP%2Bx%2F%2F%2BzAP%2FRAf%2FX%2F%2F%2FaAP%2FiAP%2FnAP%2Fq1v%2F9AP%2F%2FAP%2F%2F%2FwAAAAAAAAj%2FABsJHEiwoMGDCBMqXEiwn8OHECNKnEixosWL%2FQT2Y8Wxo8ePIEOKHEmypMaSKFOqXMnqJMuXMFW6jEmzpseZNkEyItGip0%2BfH6DYxDnSVS9ixZAmlfWq6StgSYlRymJrV61burLiuuprWKBVNImKNNasrNlmy5ilXXaWzSV979jF88YtXlx29pLZqDTK06mXYkM%2BexbNGrXD0JwNHgzNMLU3luJJ26ZO3LVq5ipHiqBix4kdPh6xDAzyGDh38FCnBse6dWp6cSS9E3eudmVy81AtuAFGioomWB4oWkn6IzJ59%2FApV646db3ldWSjaxdumu1gK3KAwcGjCvcgKbbI%2F2y0EaUyfujTq9%2FHPr0eSPPGXbNteYoELTwQQUES6xAMTJOMV15JvMwChxNXJAjIL7M0%2BAsgSyRYwybpbNONOpe1A8sDRTxhhCNMLGCIIRfoMIeAKf0wQwcQWOBiByvGyKKLBpCCDWW2xRMKA0WQMUYRRnioRBNIjIIiSixsMAEHIzSJQQYVRJkBBiI0iUAqc3kz2XSo3JdGIXmo0YUUXuDRgw5HluRAAQG06SYBA8RJgJsCANCKPuHIZZc6tFxgRW9o8EGHoHkccWJKxXmkwQEoAOEoECgkIKmkjSYRQgNugPKJJZlw4mkmHiggxBBEACeFDGIYmSZJbXCxxh1yxIh6Bhe00nqGH2GsUIYLHyxwwQJIRBHFAjFEgAQIL4CwBRPDjUZeSq8KMoi0075qbRuJ7HGCCiZU8pkZHVWSrCdi0NAsTIl29MciorTrrrR%2F9PGHJqqUYgcJhLAiBhOmeCRGCgAeGlO6ORUsEsEGJ9wRwgonzHDDBT8M8VAMVWzxxRhnrPHGFgcEACH5BAUJAPwALA8ABgAoABAAAAj%2FAAEIHEiw4EBscpIoXMhwksGHEA1%2B6sGkyRInGC826aFJVL6HTwbQ6MKl5IUBB1IeqFGApAUfRG6YuRcmjMyZ%2BsRdwvdQiU8BpIL6HPoTKI4f95ilo%2BdMmbJ38pjR88aGEzdpnrYNrDAhRwCvASRQmECWgoSvOXAMQeIMnrx68xyIGbOgGBo%2Fi%2FboUQTngUB%2BCAgIHkwFgeHCgyMEQUK3wVO4SMahYZXLVSI8q%2FpIOgMAxIcqhxFYEUGatBXRVhSbcbdU3YIG8Ni5uWOrjyFFm3JjmsRpRILfRYIDH37l9w4g9tItG6N8nTNfdHIFurULTbV9cSp14rSBQwheRsJ7%2F5BCnrwH8DwwCDkit566pfQg3XnVSlemPIlqGUIDClsGBgYEKCADBBYoICrfuCdGMkfQw5wcqRAyCiOu0AJLfXpIs40LLEQhCxQgarBCCySuoMGHs9jRjT7NxAMVU%2FFQwsorgowyiiCDNHKKIKFkM8MWMrwAw5AybGGkkUHCEE0kpYQDTjnmoHMOOejIUUcuuMTSiCmmFDKHHNfgg4IJMTxjJjQxnKCmmmVCIwwfh6yxRhttpMHGnWqgsUYefwCSCCJwWCVQFlgAo8Whh5KgqKK%2FHOqIKqu8wYkeeFh1xjR7STJJHmpQsw0ZBKWgABakklqCqAqkWgKpvTziiDbU7CphCTcDfbIHKFd18pANNqhwjDHAfgEBr7x6AewwvRADwBnWcEZQsxEBEBAAIfkEBQkA%2BwAsDwAGACgAEACHAJz%2FAKX%2FAKjYAqnTAz6NBKbcBoMACY%2F%2FCmRACpT%2FDhYKEUQsFKzSF%2F8AGcp%2FGtCRGv8AGzMUG%2FkRHD0EHicUHtVpHvoOH1cNH5n6H%2FMdIcCSIf8AIyQVI76WI8aLJVwOJkMmKionKmz%2FLTIdLUkfLVHSLfUiMFsjMWYZM%2F8ANT4yNVUkNXwAOD8oO000PXUfPYgwPlcxPmspP3smQCYVQFNEQWsqQl7%2FQ%2FoURC8jRHoxRS5FRUdFRmoxR1j%2FR4UpSD04SHwrSpU6S0c%2BS%2F8AT4I4UD8%2FUGf9UVxJUf8AUlVSU5c%2BVYw8V1lXWFZYWYQ2Wpw%2FWv8AW11bW4o4XFNQX29TYYI6YbJJYjn%2FYnE1Yoo9ZZ1EZf8AZnRcZoNYZ2pmaGozaYo8bEn6bWAub3FucSj%2FcYE6c3Rzc35rdSb%2FdgABdnU3dzcAd2OLd%2F8AeE8AeiD%2Fe1Qte3AAfR%2F%2FfjgjfoYAf3NxgEn2gkgpglP0gyJmg1jyg10xhDckhI19hf8AiF3wiYmJimLujFONjTvyjWI0k3DqlW3plZWVmqyRoXBpoXSXoqmeo32epFdYpJCSpKeipKqiqGCuqbBwrKysr7CvsUqytJCLtZCPtafZt3aet5SLt5WNt7e3uLa8u7q6vaCLvdGwvpx4v6NxwbnSwcLAw3apxcHQx4J5x8fHzKOfzMzMzZNDz76%2B0bm50rW10v8A03rM1qqu16W118J%2B1%2F8A2Kax2Kux2bam2foU2nrj2pSU3sKL3%2F8A5WZm6F5e61JS7MmN7UtL85D09yAg%2BpEU%2BvcU%2Bw4O%2BxIS%2FwAA%2Fx0A%2FyIC%2F1YA%2F1%2Fb%2F2IA%2F2XY%2F2zV%2F20A%2F2%2Fe%2F3UA%2F33k%2F371%2F4Ts%2F4T%2F%2F4b0%2F4j4%2F4nr%2F4rx%2F4r3%2F4sA%2F4v%2F%2F43x%2F471%2F475%2F5H6%2F5L2%2F5X6%2F5b%2F%2F5n0%2F5r%2B%2F50A%2F53%2F%2F6H%2F%2F6UA%2F6X%2F%2F6n%2F%2F6oA%2F6z%2F%2F64A%2F7L%2F%2F7MA%2F9EB%2F9oA%2F9v%2F%2F%2BIA%2F%2BcA%2F%2B7Y%2F%2FwA%2F%2F8AAAAAAAAAAAAAAAAAAAAACP8AVwkcSLDgQEQhRihcuJADFYMDW%2B0CJoxiRVmuXmX0VRGYoyq0cM2ydaskSVu8gtmhBJFYspcwkx1DNvNYTDWT8LFT944btnc709UTxQGElDNoyHQSuGyZs2nRojJT1rQpM6jR2Dxq18zaOXDUpIkrd82SghlbbKxIy0NgsW7r3MWV262uXbny3jRqB46c36%2Fi3uk6uwVFERsXgqxosmofPHr2IkeeK3eeZDmL%2BKr7Bu3vsB0f0nqJ0YWRHyRfeBjTx7q163ywW9fJHI7aX23YJE2AIqRIohAqQqGhoORLLlhukkRZ%2FqdXLVjP%2FxBZzkKTOWvazoUdl23QhSdZmMD%2F0BHkxY8TgVbhSLGhAYT3G9jLb%2F%2FegKlqXrmPS8dukGE6fYxhBRMEWjHEJyZk4IAGHjRYgQUSRGhBBR00iAAqPXHzDDZkeaPHB1doEQcedMTBRyF4APEJAwUA4OKLAwgg4wAvBkAAK%2Fh8wx9Q28QTSwsyLCFkGGaAQYMRS2FwgAg%2B3OCkCAlEGSWTR5SwwBqjgILJJZt0yYkqiuSgQAQkkFkDIgOJgUUacLQ5RxlYxBlnGXMQ0sYEJ4TQhAIK6KlEEzxQoKcLJEjxSUFsAiKIoouy6egdghziCSSQpLJKJYxYOlAkS5USCUR7GELKqKQqukcee2RyCikQterqq7DGAwpRQAAh%2BQQFCQCjACwPAAYAKAAQAIcAca4ApecAqdYAs90Dqs8Emf8GbQAMj%2F8QMSQRh%2F8TFhMUoPoZ%2BRUaUAUax4Qb6jUb%2FgQdKhIfIA4fv5UjxIwmNBQoVhoqOCQq%2BhQr%2FwAuLi4vLhUwSiExZhkyPxIygSM0LTo0wpc0%2FwA3HZA3WCk4Y%2F85PzU6ZCs6fR48dShBaylERTREW%2F9GNTRGjyhIijRJdTVLSkhOVkpRIcFTXU5TdDxThzhVZvpV%2FwBWWFVXQVRZcEtbmEFcpkdc%2BhRfi1Bgfk5kOP9kmUNlS1tljExmZ2RmggBnqEloUz9p%2FwBqOCRqYi5tUytwVStwdTdxSShyazR0Vup1eHR3Jv94TgB5DQF7H%2F98O%2Fp9Y0aAg3%2BDcDiENiSETk6EgwCFWfKGJm6JioyMZO6UceqVeGiZhVuZmZmfn1%2BhiK6kqbmllKunkeCpqamps5Krjbe4uLi5%2FwC7aL%2FAudLFh7TFwNDMzMzPvr7P%2FwDSt7fXoqLZl5fal3va%2FwDff3%2FivoXjhujnpbfnqsbpus3qVVXtS0v6ehP63xT6%2BhT7EhL%2BBAT%2Bhur%2FHQD%2FIgD%2FNQD%2Fadv%2FbAD%2FcwH%2Fc9z%2Feef%2Fe%2FL%2Fivb%2FiwD%2FkwD%2FmPz%2Fpf%2F%2FpwD%2Ftf%2F%2FtwD%2Fwf%2F%2F3AH%2F3ur%2F4QD%2F96X%2F%2BMf%2F%2FgD%2F%2F%2F8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI%2FwDpCBxIsOBANy1WKFzIMIbBhxANFiEzpqJFi2SwSIEoaFCeOyDv8BnUkSSeOiC5mAG1KVMmS5Zauuz0CQlERDgP6TyEs2dOnVXYZGo0yVIiSJCKEu2EJIeUNWWKrBFIyNEiRVcVMXrkqOsjRlgXVUGTKVLRS5aSGrUEJwIMGxxI1LhQhs4oTJTy6sXEl28lvVTSvESbFO2kTH4UfBBiA0YHFyouuCnESVNfvp44afZk2XLgl4mKrjUKwoKQEypqAAGiWoahULBjy54dqsuZS6GNhk76pcGRF0DAKMgiKoaMIj6S2NnDfM8bHNChv2lupM0kSYYTobWkowMPGz1%2BcPpQQQRGhDIYIIhYzx6C%2B%2FfsDcgxTBTmpEY6UCxRsgS8jRc9nFBGCA4wYOCBE1CgIAUPHGiAHp1gJ5qEQ7hgwxNbbPEEE06Q0UQRCxQQAAECkBhAASiiOGKJAIzRxx%2BABBLjjDGY1gMPTmihoxItrHFDCQkcIGQBCbBgpJFBCgkAAh5UIEEFHjy5wZQKRDAeajBckIMbdEwxRRBghmnFmGOGGcQIHaSgQA4WpBBDHG6swYENGsjAQQVS1MGlQGF44eWfV%2FTpxaBX%2FDkDCDSssYYJNOxJRxYrFOEGDTkYFEccYngRxaBqXOqpGoNqesZAazgqUKl0uGGqQAEBACH5BAUJAKQALA8ABgAoABAAhwAqAACs%2FwKo1gOa%2FwRElgWDAAcOAwmP%2FwtkOxSs0hkvDhnKfxnNkRr%2BAxz4FB7VaR8xFR%2BZ%2BiHAkiH%2FACMlGCO%2BliPGiyZSEicpJCkzJips%2FyxFHS31Ii4yHTFUIjNLIzP%2FADQ6LDVeHjV8ADo3Nzt9ITxoK0P6FEVHRUVSO0Vb%2F0hmLUhxM0v%2FAEx4M06JNlBl%2FlSWOlc%2BL1hZVlj%2FAFlHJ1t2SVxvNFx8N16RQV9pWl%2BB0WCdQ2I5%2F2Jdb2X%2FAGhiYWisSGpxZmpyNmxPK22FPXE3IXYAAXYl%2F3ZJ%2BHc3AHf%2FAHhPAHh6d3lcMHtwAHxMKn0f%2F32baX6GAIVZ8oX%2FAIaIhocuIYdJiIhTL4pi74p6mI048Y54dJBk75IubZNw6pSwf5d62ZmZmZxboKBrkKF2lKGln6Nal6RXWKmMi6mpqaqxcbOMjbRovLWn2bZyl7mWiLq6ur6hk8GpbsG50sJxocXA0MiAd8ySQMzMzMzSyM%2B%2BvtK3t9emqtfDfdieq9j%2FANn6FNqUlNy6euKG6OVmZutUVO1LS%2FcgIPqRFPr3FPsSEv4DA%2F8dAP8iAv9WAP9m2P9rAP9w3%2F91AP975%2F%2BG7P%2BJ9f%2BLAP%2BW%2B%2F%2BdAP%2Bn%2F%2F%2BpAP%2By%2F%2F%2BzAP%2FN7v%2FUAf%2FjAP%2Fq1f%2F%2BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAj%2FAPUIHEiw4MAxGDooXMhwhsGBfAYdQjSRop8%2BGPsYongojY4%2FfgCJDDmSEKEuD%2FUkasSyZSNGMGG6PMJG1KZMNy3dvPlJlAwrcuTUkTPw0SNJlJBSguSoaVNISSUpUbMpks5MlSbh1OpDgYgQIVKEsCJQESZOaNNiWss2LRMzOXFmuiQXC4AYQVyI4OECg0BSnECFGjw4LVrBg5%2FAlRtJ7iY3BmLkMOFCb2UUYxaN2sy5s%2BdRU8p0ulRp7lxLhTCUmCwlhY49QlJYISEo0JIWNHJXCcSbdxXcP0bAOY219CUyCiTnkJLhQxgbEJqsOQFiQoPr16trx96ggJ1KVx1j3bnwgsiNF5LRm2iih4ODBRIsyH9w3YH9BxXkI8CT06rpL6sZcQUUQ%2BCAQxFFkLBGAgIM4OCDAkQYYQAPEpCHKFft1Akae%2FHlBBRZhGgEEHdEcIAGKqSoggYHtNgiijDs4EMNdMTRhho2xjFHFwZsUBl6L6zQwQxEJdEDEkhGgWQPTDKJJBdbrBCDAShAcAGVM8xAwQYYVHkBBVmuMRCSVGhRpplJIpmEF2JYocAHfjXHnkBWCLlGChucYVCZdfTp55llvnGHHnKggIEUd6CQQkFNLHqGEClFKumkkQYEACH5BAUJAP0ALA8ABgApABAAhwBzswCb%2FwCl5wCp1gCz3QOqzwR66gZrAAqU%2FwspIQyP%2Fw6AAA%2Ba%2FxGH%2FxIYChP8FRQ0DRSg%2Bhj0HxrHhBr%2FABvqNRz5Eh1UDB37DR%2B%2FlSM1GyPEjCRFGyUYJSUmFyc9AigwECr6FCz%2FAC1UIy48QS5pGy9KIjEzKzNkFjQyCzR0GzTClzT%2FADVDLjVfHzdnIThKNThj%2FzpaKT9SN0BnLENDQ0N0L0Rb%2F0R%2BLkVEM0Y4OUZKQ0ldP0l7LEsWOExKTExUSUxjPUx1M0yGNk0NtE41HFAr7FOUP1OWNVP%2FAFRWUlVeT1Vm%2BlV9NVabPVeKPViAOVqTP1yJOVydQ1z6FFz%2FAF15UV9OOl%2BXQWE6%2F2J5N2KmJ2SkR2VMtmVfYmaCAGc0%2F2g7%2F2iIPGkz%2F2luZWn%2FAGpzZ2tqMnF%2BOHNRK3Ul%2F3VcSHgMAXhOAHmHcHp7eXsf%2F3wh%2F3w7%2Bn1jRn1tXn4xIX9S9IEs%2F4E%2FJoGNeoJW84NPLIOFgoROToSJg4WCAIdgcohd8Ioua4piM4xa84xk7oyMjI2ZhpRx6pV2Z5V2apV8a5d%2BY5mEW5mZmZtEiZ1vk5%2Bfn6CMmaCkZKF7kKOK4qSkpKd0m6enhqqqq6uX3a%2Bwr7Fqu7i4uLn%2FAL6%2FvsByw8C50sFslcHFv8XA0MXFxcrKyszMzM%2B%2Bvs%2F%2FANG6utK0tNT%2FANeiotmRc9mXl9z%2FAN7m2t9%2Ff%2BK%2FhOOvx%2BZ%2B3uhcXOiszOmowumwyOqqt%2BtSUu1LS%2FLA0PmQ%2B%2Fp6E%2FrfFPr6FPsSEvwPD%2F8BAf8dAP8jAP81AP9g4P9p2%2F9sAP9zAf9z2%2F9z7%2F914P964P9%2B6v9%2B8%2F%2BD6f%2BD7%2F%2BE5v%2BF6v%2BF8P%2BG%2BP%2BH7f%2BJ8P%2BJ9v%2BK6%2F%2BLAP%2BN8f%2BO%2FP%2BQ9f%2BTAP%2BT%2Bv%2BT%2F%2F%2BW%2Bf%2BW%2Ff%2Ba%2F%2F%2Bb8v%2Bd%2F%2F%2Bh%2F%2F%2Bi%2B%2F%2Bk%2F%2F%2BlAP%2BrAP%2Br%2F%2F%2ByAP%2By%2F%2F%2B4%2Ff%2B6AP%2FB%2F%2F%2FcAf%2Fe4P%2Fe8f%2FhAP%2Fh8f%2F0o%2F%2F5x%2F%2F7AP%2F9AP%2F%2FAAAAAAAAAAAAAAj%2FAE8JHEiw4MBNOnIoXMjwh8GHEB%2BaacRIUaJFGC8qajTnjSmItni9UrWqpCxeu1LuaoWKZJ9J%2BeS9g2fOnMyZ9PBd%2BQSRmE9hw4L6HPoTKBtM8JBZKwfNmTNv5JJdu7cmE8RfyowV07p1mbKvy45tNcZGkjpo38ihG%2FcsHLlq5UCBaPHGzyE%2BHwX2W8etr1926wID9tuGUrtya5mpRSwPlAMVWGSYeCKjxkBg89wJXhfPnmfP8TjHK3wYbrZz3bChq9UBcg8bLlD04FDD0qlg%2FHLv2627t77cfyCls9ZWGrVtT31c4ELDigw3o%2FIEWeLAFJUyqWCx2u4piXfvnrTD%2F%2FpyaRq0tdikIeYEAYkTG4dOAImVR4MSL6dCUGDBvz%2BF%2FwD2t4AoqIUjFWLiCHLBE1pEMcRrKuAwgh8CrTCBBBhYoGEFGWzgYQYVZPjAAa7U0wxUBaLzSAlS1IHHGVJgEcUUUCjRySkRBCBAAQP0KEAAQAK5Y48A0DGLLrfQoiQuvQDyAhdNpIHHHlQOsscJNzIRQwMIKOBlAzeEGSaXXhqQQAoeOADCmiekqcEQUxzBIBpnFKGDVafEoQYYWfTZJxyAAjpGn0aQsIUNSgDhBAS2GcKBEPJxMAIHHMCA10CFBKLGppvKkWkgoMqxKREf9IBlC0IAMRAZUDjgyAwm%2FCkQSSkFhRIKInbooWslpNhqqya6dgEDXafssASep3yyhAeWHMIDsgQFBAAh%2BQQFCQCwACwPAAYAKQAQAIcAO4oApP8CqNYDmf8FggAJj%2F8KFAsLaEIMTAAUrNIVJwgZyn8az5Ea%2FgMcKhUc%2BBQdOgke1WkfmfohwJIh%2FwAiGh4iScUjvpYjxoslIhonKSUqRB0qa%2F8sMxwsVB0t9SIydQsz%2FwA0OTI2Nig3Vio4NGk8ayo%2BQTE%2Bdys%2FiSdCZy1D%2BhREdy1Ejy1FW%2F9FbjRIRkNKeTJL%2FwBNZP9NkhZNojNPW0hRhjdSejxWkzpWmEFYUE5YWVhY%2FwBZRyVaDb9ad0laoUZdWm5da1NfUy9iOf9ihT1lqEdl%2FwBodDVqLFxqRvtqlU1qoipsbGttcVdwcW9yNCNzZjJ2AAF2Jv92Vy53NwB3%2FwB4TwB4d3Z4hm55Ryl6MPx7cAB8Hv9%2BhgCBIP%2BDRiqFaTaF%2FwCGhYeIVPOLOyWMY%2B6MgkCZmZmed4%2BfoZ%2Bga5ChVqKhdpSkV1imjuCplN6qq6mqsXGrh4m0jny2cpe2qde3l428vLy%2Fn5PCcaHDVcXEv9DFwdDMzMzNsnXPlUTPvr7Rt7fXnavXpqrXw33Y%2FwDZbdnZ%2BhTalJTcvoTd4dzlZmbmiuznb9XrVFTtS0v3ICD6kRT6rBT69xT7EhL%2BAwP%2Be%2Bf%2FHQD%2FIgL%2FVgD%2FZtj%2FawD%2FcN%2F%2FdQD%2Ff%2Fn%2Fhu3%2FivT%2FiwD%2Fl%2Fv%2FnQD%2Fpv%2F%2FqQD%2Fsv%2F%2FswD%2F0Pr%2F1AH%2F4wD%2F6tb%2F%2FgD%2F%2F9sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI%2FwD%2FCBxIsCDBNBo6KFzIcIdBgoIUQYo0kWKhQRgHNaII6c0QQ4UIiQw5chGgLHke%2FpF0qaXLS5Zixnw5ZU4rU6RwisKZU9WrJ3dUatLU6VPRT5syDR26yWgnK3RMcQpFShQmTDtB8VEzYs0aKHIKThp1qqzZUWjTmsXihmfVt6baKPBAV4WKEQUpnVrFim9fs2X9surSNqcoToYROUjRooXdHCRgpBlYyZXly5gzu%2FrCBpVVuI8qgMgRA4iKJ6ZtwBiY6NAVGT1ijzlEm%2FYY2EhA2KlK9aopJQiCxNBSx0AaRiKGOBm4IgSFBtChO5%2F%2BHDqBPb7fOtKAQkcOHS82sPxgwsL4wA8PFlzAwD7Cg%2FfvI0xgf6COKapTTSES0ULKliQ3BKFDCjl0EJZACQgwwIIMCuCggwwGAEAgrexkCiqoeHJCDUZsYUYYVUiRBBo%2B8DCQBAVw4MKKLnBQwIsvqjiDBQYQAUgddOChIx0VsHBEEEYkIYUYVUQBw4F%2FLFEEFV4wyWQRUELJ5A8jNKGCBhBAIAIPPBgAgQMbkGACCmR2wENKA3HBxRlstukkk2WcUQINOMAARQwxTPZHFji8wIMIJDiQhhxIDgRHUAXFoaiifvwhhAIGkOGEAhqgmUcHDpy5gQgqdSpQo6CSkZAcopo4EA8aQPGHDao%2BFBAAIfkEBQkApQAsDwAGACcAEACHAD6UAHgAAKL%2FAKveAqbkA5X%2FBzoACEmiCg0DC%2F8AESQFET0AE6zZFP8AFvcWGHFAGoL%2FGtFyG3r%2FHCgVHFwLHJf6HdxWHedfIN5OIS4cIzcVJCciJRsPJjEkJmz%2FJm8WKP8AKkoUKvMpK1McL0wiMDIvMVAdMfoUMnYYM00oNDRENUIxOFYnOWImOj02PIUnPksTRE0%2FRT05RX81RmoxRn4ARxO5R0QoST0rSUr%2FSlRLSo82S14qU0b%2BU2lFVjlQWXdHWYQ7WltYWns3XplAXzepZXY1aENpaGUxabNLa2pqa3BSa4pdbSv%2Fb3tqcC0QcQwMcmIAdFcudHh0dUoAdbk4dif%2FeTskef8AfjP7f34AgEqCg1Esg6RrhUv1hiwghkwri1Xyi42Li5KHi%2F8Aj3RSkmXtlv8Al22MmZmZnniJoZXDo6lxqGyWqqqqrFmyrZrcsKKis5SRtKXZubm5vaOTvodjv5HHxKVnxnCEzMzMz7akz7%2B%2F0rOz3cB93foU3%2F8A4XV15Gtr5HXk5P8A6lJS7brG7dqS7sfF9C4u9dqu%2BbIU%2BpwU%2BvUU%2FTQK%2FgYG%2FqoA%2FrIA%2FswA%2FyoA%2F1YA%2F2gA%2F2nb%2F3Xc%2F3r5%2F33r%2F4Ts%2F4r1%2F5b8%2F5kB%2F6j%2F%2F7P%2B%2F9gA%2F%2B%2Fn%2F%2FTb%2F%2F0A%2F%2F%2FlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACP8A9QgcSLDgwDQ4Et5YyJAhHYN6%2BvQxKLEiwThLDikyxLEjR0V%2BfPAxmOhRoUCCUpZ8xPJRIpSBoLAJxYnTp02ZPOm0SarMHIOOJrVsOSlo0KFQ0niypKmmJqacMm26gyONQUadKGnd2qlr10pbn6jZibOm2R8KRmSI4UOHG4GLInn1CimSXUh0qYw1e8mspy0GdhBp0YIIjQlvG42SxLjxqMePQTWOguZmX6eb3ijYEYSwDxY0WGxQ8ocQZMiEUqc%2BrQVN2ah9B01AMXjMCiWhprgYI%2BQECDJngp%2FB0gCE8QZYhNdoI9XTJrOAiUhnskFDFyAaSigR4SCB9%2B8Owoff%2F54gQJ6bT5tyOkLBiJQhLwSj2NGihBsGDCJg2I8hAoEBABKgnwUXPGCHKM99oiAnW3xAxBVfgIHEENIZIYMbFRSg4YYcdlgAADjgUYccI9axxw8jJEGEexJyAcYTF%2FaQgwQ01ihjDjJ6QOMBJrCAAAIhKFCCEC5MMAEJMyQ5xBA8cPDDW1lY0cSUVEpp5ZQ2wFAFC0LQkMQEAtGRAhEIVEdCBzq4NdAcc5jhxZtvwsGmnGGEUUQII6hAx5FiDCSGaHR89hZEc8r5E0FsrlHCBn2WsAJBdHQghB5jOAFRQAA7";

function wetfrog() {
  var textarea = document.getElementById("content_form");
  if(textarea) {
    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    var size = end - start;
    var value = textarea.value;
    var selection = value.substring(start, end);
    var arcenciel = "";
    if(size > 0) {
      var step = (255 * 5) / (size - 1);
      for(let i = 0; i < size; ++i) {
        var color = colorize(i * step);
        arcenciel += "[#" + color + "]" + selection[i] + "[/#" + color + "]";
      }
    }
    if(size === 1) {
      arcenciel = "[#ff0000]" + selection + "[/#ff00ff]";
    }
    textarea.value = value.substring(0, start) + arcenciel + value.substring(end);
  }
}

var spacer = document.querySelector("html body#category__redaction_form__form_message div.container " +
  "div#mesdiscussions.mesdiscussions form#hop table.main tbody " +
  "tr.reponse td.repCase2 div.left + div.spacer");

if(spacer) {
  var divfrog = document.createElement("div");
  divfrog.setAttribute("class", "left");
  divfrog.style.textAlign = "right";
  var frog = document.createElement("img");
  frog.style.cursor = "pointer";
  frog.setAttribute("title", "Colorer le texte sélectionné en arc-en-ciel.");
  frog.setAttribute("alt", "arc-en-ciel");
  frog.setAttribute("width", "69");
  frog.setAttribute("height", "28");
  frog.setAttribute("src", frogimg);
  frog.addEventListener("click", wetfrog, false);
  //divfrog.appendChild(document.createTextNode(" \u00A0\u00A0 "));
  divfrog.appendChild(frog);
  spacer.parentElement.insertBefore(divfrog, spacer);
}
