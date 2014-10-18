using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HtmlAgilityPack;
using System.Web.Http;

namespace BrowserBlast.Controllers
{
    public class RelayController : Controller
    {
        // GET: Relay
        public ActionResult Index(String url)
        {
			//bla bla bla hayden smells
            //TODO: check valid url
			HtmlWeb web = new HtmlWeb();
			HtmlDocument doc = web.Load("http://" + url);
            return Content(doc.DocumentNode.OuterHtml);
        }
    }
}