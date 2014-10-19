using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HtmlAgilityPack;
using System.Web.Http;
using Microsoft.AspNet.SignalR;
using BrowserBlast.Hubs;

namespace BrowserBlast.Controllers
{
    public class RelayController : Controller
    {
		Lazy<IHubContext> hub = new Lazy<IHubContext>(
			() => GlobalHost.ConnectionManager.GetHubContext<GameHub>()
		);

        // GET: Relay
        public ActionResult Index(String url)
        {
			return Content(GameHub.CurrentPage);
        }
    }
}